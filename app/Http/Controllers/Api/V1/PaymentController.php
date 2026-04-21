<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Setting;
use App\Traits\ApiResponses;
use Barryvdh\DomPDF\Facade\Pdf;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class PaymentController extends Controller
{
    use ApiResponses;

    public function index($invoiceId)
    {
        $invoice = Invoice::query()->findOrFail($invoiceId);

        $payments = $invoice->payments()
            ->with(['creator'])
            ->orderByDesc('payment_date')
            ->orderByDesc('id')
            ->get();

        return $this->successResponse($payments);
    }

    public function store(Request $request, $invoiceId)
    {
        $invoice = Invoice::query()->findOrFail($invoiceId);

        if ($invoice->status === 'cancelled') {
            throw ValidationException::withMessages([
                'invoice' => ["Impossible d'ajouter un paiement à une facture annulée."],
            ]);
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'nullable|string|max:50',
            'payment_date' => 'required|date',
            'reference_number' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]);

        $alreadyPaid = (float) $invoice->payments()->sum('amount');
        $total = (float) $invoice->total_amount;
        $balance = $total - $alreadyPaid;
        $amount = (float) $validated['amount'];

        if ($amount > ($balance + 0.0001)) {
            throw ValidationException::withMessages([
                'amount' => ["Le montant dépasse le solde restant (" . number_format(max($balance, 0), 2, ',', ' ') . ")."],
            ]);
        }

        $payment = $invoice->payments()->create([
            'amount' => $validated['amount'],
            'payment_method' => $validated['payment_method'] ?? null,
            'payment_date' => $validated['payment_date'],
            'reference_number' => $validated['reference_number'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'created_by' => Auth::id(),
        ]);

        $this->recalculateInvoice($invoice->fresh());

        return $this->successResponse($payment->load(['creator']), 'Paiement enregistré avec succès', 201);
    }

    public function destroy($id)
    {
        $payment = Payment::query()->with(['invoice'])->findOrFail($id);
        $invoice = $payment->invoice;

        $payment->delete();

        if ($invoice) {
            $this->recalculateInvoice($invoice->fresh());
        }

        return $this->noContentSuccessResponse('Paiement supprimé');
    }

    public function receipt($id)
    {
        if (! extension_loaded('gd')) {
            return response()->json([
                'message' => "La génération PDF nécessite l'extension PHP GD (ext-gd). Activez-la dans votre php.ini (extension=gd) puis redémarrez PHP/Apache. php_ini=" . (php_ini_loaded_file() ?: 'unknown') . " php_bin=" . (defined('PHP_BINARY') ? PHP_BINARY : 'unknown'),
            ], 500);
        }

        $payment = Payment::query()
            ->with(['invoice.client', 'invoice.sector', 'invoice.quote', 'creator'])
            ->findOrFail($id);

        $settings = Setting::query()->first();
        $verifyUrl = url('/verify/payments/' . $payment->id);

        $qrDataUri = (new QRCode(new QROptions([
            'scale' => 5,
        ])))->render($verifyUrl);

        $watermarkBase64 = base64_encode(file_get_contents(public_path('img/dark_logo.png')));

        $pdf = Pdf::loadView('pdf.payment_receipt', [
            'payment' => $payment,
            'invoice' => $payment->invoice,
            'settings' => $settings,
            'qrDataUri' => $qrDataUri,
            'verifyUrl' => $verifyUrl,
            'watermarkBase64' => $watermarkBase64,
        ])->setPaper('a4');

        return $pdf->stream('recu-' . $payment->id . '.pdf');
    }

    private function recalculateInvoice(Invoice $invoice): void
    {
        $paid = (float) $invoice->payments()->sum('amount');
        $status = $invoice->status;

        if ($status !== 'cancelled') {
            if ($paid <= 0) {
                $status = 'unpaid';
            } elseif ($paid >= (float) $invoice->total_amount) {
                $status = 'paid';
            } else {
                $status = 'partial';
            }
        }

        $invoice->update([
            'amount_paid' => $paid,
            'status' => $status,
        ]);
    }
}
