<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
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

class QuoteController extends Controller
{
    use ApiResponses;

    public function index()
    {
        $quotes = Quote::query()
            ->with(['client', 'sector'])
            ->orderByDesc('id')
            ->get();

        return $this->successResponse($quotes);
    }

    public function show($id)
    {
        $quote = Quote::query()
            ->with(['client', 'sector', 'items'])
            ->findOrFail($id);

        return $this->successResponse($quote);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'sector_id' => 'required|exists:sectors,id',
            'status' => 'nullable|in:draft,sent,accepted,rejected',
            'issue_date' => 'required|date',
            'valid_until' => 'nullable|date|after_or_equal:issue_date',
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
        $validated['status'] = $validated['status'] ?? 'draft';
        $validated['quote_number'] = $this->generateQuoteNumber();

        $subtotal = collect($items)->sum(function ($item) {
            return (float) $item['quantity'] * (float) $item['unit_price'];
        });

        $validated['subtotal'] = $subtotal;
        $validated['tax_amount'] = 0;
        $validated['total_amount'] = $subtotal;

        $quote = DB::transaction(function () use ($validated, $items) {
            $quote = Quote::create($validated);

            foreach ($items as $item) {
                $quote->items()->create([
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit' => $item['unit'] ?? null,
                    'unit_price' => $item['unit_price'],
                    'total' => (float) $item['quantity'] * (float) $item['unit_price'],
                ]);
            }

            return $quote;
        });

        return $this->successResponse($quote->load(['client', 'sector', 'items']), 'Devis créé avec succès', 201);
    }

    public function update(Request $request, $id)
    {
        $quote = Quote::query()->with(['items'])->findOrFail($id);

        $validated = $request->validate([
            'client_id' => 'sometimes|exists:clients,id',
            'sector_id' => 'sometimes|exists:sectors,id',
            'status' => 'sometimes|in:draft,sent,accepted,rejected',
            'issue_date' => 'sometimes|date',
            'valid_until' => 'nullable|date',
            'notes' => 'nullable|string',
            'items' => 'nullable|array|min:1',
            'items.*.description' => 'required_with:items|string|max:255',
            'items.*.quantity' => 'required_with:items|numeric|min:0.01',
            'items.*.unit' => 'nullable|string|max:50',
            'items.*.unit_price' => 'required_with:items|numeric|min:0',
        ]);

        $items = $validated['items'] ?? null;
        unset($validated['items']);

        $updatedQuote = DB::transaction(function () use ($quote, $validated, $items) {
            $quote->update($validated);

            if (is_array($items)) {
                $quote->items()->delete();

                foreach ($items as $item) {
                    $quote->items()->create([
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

                $quote->update([
                    'subtotal' => $subtotal,
                    'tax_amount' => 0,
                    'total_amount' => $subtotal,
                ]);
            }

            return $quote->fresh();
        });

        return $this->successResponse($updatedQuote->load(['client', 'sector', 'items']), 'Devis mis à jour');
    }

    public function destroy($id)
    {
        $quote = Quote::findOrFail($id);
        $quote->delete();

        return $this->noContentSuccessResponse('Devis supprimé');
    }

    public function pdf($id)
    {
        if (! extension_loaded('gd')) {
            return response()->json([
                'message' => "La génération PDF nécessite l'extension PHP GD (ext-gd). Activez-la dans votre php.ini (extension=gd) puis redémarrez PHP/Apache. php_ini=" . (php_ini_loaded_file() ?: 'unknown') . " php_bin=" . (defined('PHP_BINARY') ? PHP_BINARY : 'unknown'),
            ], 500);
        }

        $quote = Quote::query()
            ->with(['client', 'sector', 'items'])
            ->findOrFail($id);

        $settings = Setting::query()->first();
        $verifyUrl = url('/verify/quotes/' . $quote->uuid);

        $qrDataUri = (new QRCode(new QROptions([
            'scale' => 5,
        ])))->render($verifyUrl);

        $watermarkBase64 = base64_encode(file_get_contents(public_path('img/dark_logo.png')));

        $pdf = Pdf::loadView('pdf.quote', [
            'quote' => $quote,
            'settings' => $settings,
            'qrDataUri' => $qrDataUri,
            'verifyUrl' => $verifyUrl,
            'watermarkBase64' => $watermarkBase64,
        ])->setPaper('a4');

        return $pdf->stream($quote->quote_number . '.pdf');
    }

    private function generateQuoteNumber(): string
    {
        $year = now()->format('Y');
        $prefix = 'DEV-' . $year . '-';

        $latest = Quote::query()
            ->where('quote_number', 'like', $prefix . '%')
            ->orderByDesc('id')
            ->value('quote_number');

        $next = 1;

        if (is_string($latest) && str_starts_with($latest, $prefix)) {
            $suffix = substr($latest, strlen($prefix));
            if (is_numeric($suffix)) {
                $next = ((int) $suffix) + 1;
            }
        }

        $candidate = $prefix . str_pad((string) $next, 4, '0', STR_PAD_LEFT);

        while (Quote::query()->where('quote_number', $candidate)->exists()) {
            $next++;
            $candidate = $prefix . str_pad((string) $next, 4, '0', STR_PAD_LEFT);
        }

        return $candidate;
    }
}
