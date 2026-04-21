<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Quote;
use App\Models\Setting;
use App\Traits\ApiResponses;
use Barryvdh\DomPDF\Facade\Pdf;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InvoiceController extends Controller
{
    use ApiResponses;

    public function index()
    {
        $invoices = Invoice::query()
            ->with(['client', 'sector', 'quote'])
            ->orderByDesc('id')
            ->get();

        return $this->successResponse($invoices);
    }

    public function show($id)
    {
        $invoice = Invoice::query()
            ->with(['client', 'sector', 'quote', 'items', 'payments'])
            ->findOrFail($id);

        return $this->successResponse($invoice);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'sector_id' => 'required|exists:sectors,id',
            'quote_id' => 'nullable|exists:quotes,id',
            'status' => 'nullable|in:unpaid,partial,paid,cancelled',
            'issue_date' => 'required|date',
            'due_date' => 'nullable|date|after_or_equal:issue_date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string|max:255',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit' => 'nullable|string|max:50',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $items = $validated['items'];
        unset($validated['items']);

        $validated['uuid'] = Str::uuid()->toString();
        $validated['created_by'] = Auth::id();
        $validated['status'] = $validated['status'] ?? 'unpaid';
        $validated['invoice_number'] = $this->generateInvoiceNumber();

        $subtotal = collect($items)->sum(function ($item) {
            return (float) $item['quantity'] * (float) $item['unit_price'];
        });

        $validated['subtotal'] = $subtotal;
        $validated['tax_amount'] = 0;
        $validated['total_amount'] = $subtotal;
        $validated['amount_paid'] = 0;

        $invoice = DB::transaction(function () use ($validated, $items) {
            $invoice = Invoice::create($validated);

            foreach ($items as $item) {
                $invoice->items()->create([
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit' => $item['unit'] ?? null,
                    'unit_price' => $item['unit_price'],
                    'total' => (float) $item['quantity'] * (float) $item['unit_price'],
                ]);
            }

            return $invoice;
        });

        return $this->successResponse($invoice->load(['client', 'sector', 'quote', 'items']), 'Facture créée avec succès', 201);
    }

    public function storeFromQuote($quoteId)
    {
        $quote = Quote::query()->with(['items'])->findOrFail($quoteId);

        $invoice = DB::transaction(function () use ($quote) {
            $invoice = Invoice::create([
                'uuid' => Str::uuid()->toString(),
                'client_id' => $quote->client_id,
                'quote_id' => $quote->id,
                'sector_id' => $quote->sector_id,
                'invoice_number' => $this->generateInvoiceNumber(),
                'status' => 'unpaid',
                'issue_date' => now()->toDateString(),
                'due_date' => null,
                'subtotal' => $quote->subtotal,
                'tax_amount' => $quote->tax_amount,
                'total_amount' => $quote->total_amount,
                'amount_paid' => 0,
                'notes' => $quote->notes,
                'created_by' => Auth::id(),
            ]);

            foreach ($quote->items as $item) {
                $invoice->items()->create([
                    'description' => $item->description,
                    'quantity' => $item->quantity,
                    'unit' => $item->unit,
                    'unit_price' => $item->unit_price,
                    'total' => $item->total,
                ]);
            }

            return $invoice;
        });

        return $this->successResponse($invoice->load(['client', 'sector', 'quote', 'items']), 'Facture créée à partir du devis', 201);
    }

    public function update(Request $request, $id)
    {
        $invoice = Invoice::query()->with(['items', 'payments'])->findOrFail($id);

        $validated = $request->validate([
            'client_id' => 'sometimes|exists:clients,id',
            'sector_id' => 'sometimes|exists:sectors,id',
            'quote_id' => 'nullable|exists:quotes,id',
            'status' => 'sometimes|in:unpaid,partial,paid,cancelled',
            'issue_date' => 'sometimes|date',
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'items' => 'nullable|array|min:1',
            'items.*.description' => 'required_with:items|string|max:255',
            'items.*.quantity' => 'required_with:items|numeric|min:0.01',
            'items.*.unit' => 'nullable|string|max:50',
            'items.*.unit_price' => 'required_with:items|numeric|min:0',
        ]);

        $items = $validated['items'] ?? null;
        unset($validated['items']);

        $updated = DB::transaction(function () use ($invoice, $validated, $items) {
            $invoice->update($validated);

            if (is_array($items)) {
                $invoice->items()->delete();

                foreach ($items as $item) {
                    $invoice->items()->create([
                        'description' => $item['description'],
                        'quantity' => $item['quantity'],
                        'unit' => $item['unit'] ?? null,
                        'unit_price' => $item['unit_price'],
                        'total' => (float) $item['quantity'] * (float) $item['unit_price'],
                    ]);
                }

                $subtotal = collect($items)->sum(function ($item) {
                    return (float) $item['quantity'] * (float) $item['unit_price'];
                });

                $invoice->update([
                    'subtotal' => $subtotal,
                    'tax_amount' => 0,
                    'total_amount' => $subtotal,
                ]);
            }

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

            return $invoice->fresh();
        });

        return $this->successResponse($updated->load(['client', 'sector', 'quote', 'items', 'payments']), 'Facture mise à jour');
    }

    public function destroy($id)
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->delete();

        return $this->noContentSuccessResponse('Facture supprimée');
    }

    public function pdf($id)
    {
        if (! extension_loaded('gd')) {
            return response()->json([
                'message' => "La génération PDF nécessite l'extension PHP GD (ext-gd). Activez-la dans votre php.ini (extension=gd) puis redémarrez PHP/Apache. php_ini=" . (php_ini_loaded_file() ?: 'unknown') . " php_bin=" . (defined('PHP_BINARY') ? PHP_BINARY : 'unknown'),
            ], 500);
        }

        $invoice = Invoice::query()
            ->with(['client', 'sector', 'quote', 'items', 'payments'])
            ->findOrFail($id);

        $settings = Setting::query()->first();
        $verifyUrl = url('/verify/invoices/' . $invoice->uuid);

        $qrDataUri = (new QRCode(new QROptions([
            'scale' => 5,
        ])))->render($verifyUrl);

        $watermarkBase64 = base64_encode(file_get_contents(public_path('img/dark_logo.png')));

        $pdf = Pdf::loadView('pdf.invoice', [
            'invoice' => $invoice,
            'settings' => $settings,
            'qrDataUri' => $qrDataUri,
            'verifyUrl' => $verifyUrl,
            'watermarkBase64' => $watermarkBase64,
        ])->setPaper('a4');

        return $pdf->stream($invoice->invoice_number . '.pdf');
    }

    private function generateInvoiceNumber(): string
    {
        $year = now()->format('Y');
        $prefix = 'FAC-' . $year . '-';

        $latest = Invoice::query()
            ->where('invoice_number', 'like', $prefix . '%')
            ->orderByDesc('id')
            ->value('invoice_number');

        $next = 1;

        if (is_string($latest) && str_starts_with($latest, $prefix)) {
            $suffix = substr($latest, strlen($prefix));
            if (is_numeric($suffix)) {
                $next = ((int) $suffix) + 1;
            }
        }

        $candidate = $prefix . str_pad((string) $next, 4, '0', STR_PAD_LEFT);

        while (Invoice::query()->where('invoice_number', $candidate)->exists()) {
            $next++;
            $candidate = $prefix . str_pad((string) $next, 4, '0', STR_PAD_LEFT);
        }

        return $candidate;
    }
}
