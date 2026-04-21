<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Quote;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class CrmDashboardController extends Controller
{
    use ApiResponses;

    public function index(Request $request)
    {
        $validated = $request->validate([
            'from' => 'nullable|date',
            'to' => 'nullable|date',
            'sector_id' => 'nullable|exists:sectors,id',
            'client_id' => 'nullable|exists:clients,id',
            'group_by' => 'nullable|in:day,month',
        ]);

        $from = isset($validated['from'])
            ? Carbon::parse($validated['from'])->toDateString()
            : now()->subDays(29)->toDateString();

        $to = isset($validated['to'])
            ? Carbon::parse($validated['to'])->toDateString()
            : now()->toDateString();

        if (Carbon::parse($to)->lessThan(Carbon::parse($from))) {
            [$from, $to] = [$to, $from];
        }

        $sectorId = $validated['sector_id'] ?? null;
        $clientId = $validated['client_id'] ?? null;

        $diffDays = Carbon::parse($from)->diffInDays(Carbon::parse($to));
        $groupBy = $validated['group_by'] ?? ($diffDays > 62 ? 'month' : 'day');

        $invoiceBase = Invoice::query()
            ->when($sectorId, fn($q) => $q->where('sector_id', $sectorId))
            ->when($clientId, fn($q) => $q->where('client_id', $clientId));

        $invoiceRange = (clone $invoiceBase)->whereBetween('issue_date', [$from, $to]);

        $quoteRange = Quote::query()
            ->when($sectorId, fn($q) => $q->where('sector_id', $sectorId))
            ->when($clientId, fn($q) => $q->where('client_id', $clientId))
            ->whereBetween('issue_date', [$from, $to]);

        $paymentRange = Payment::query()
            ->when($sectorId || $clientId, function ($q) use ($sectorId, $clientId) {
                $q->whereHas('invoice', function ($inv) use ($sectorId, $clientId) {
                    $inv->when($sectorId, fn($x) => $x->where('sector_id', $sectorId))
                        ->when($clientId, fn($x) => $x->where('client_id', $clientId));
                });
            })
            ->whereBetween('payment_date', [$from, $to]);

        $statusCounts = $invoiceRange
            ->selectRaw('status, COUNT(*) as c')
            ->groupBy('status')
            ->pluck('c', 'status')
            ->toArray();

        $totalBilled = (float) $invoiceRange->sum('total_amount');
        $amountPaidInInvoices = (float) $invoiceRange->sum('amount_paid');
        $totalCollected = (float) $paymentRange->sum('amount');

        $invoicesCount = (int) $invoiceRange->count();
        $quotesCount = (int) $quoteRange->count();
        $paymentsCount = (int) $paymentRange->count();

        $clientsCount = (int) Client::query()
            ->when($clientId, fn($q) => $q->where('id', $clientId))
            ->count();

        $newClientsCount = (int) Client::query()
            ->when($clientId, fn($q) => $q->where('id', $clientId))
            ->whereBetween('created_at', [
                Carbon::parse($from)->startOfDay(),
                Carbon::parse($to)->endOfDay(),
            ])
            ->count();

        $outstanding = max($totalBilled - $amountPaidInInvoices, 0);
        $collectionRate = $totalBilled > 0 ? round(($amountPaidInInvoices / $totalBilled) * 100, 2) : 0;

        if ($groupBy === 'month') {
            $billedSeries = $invoiceRange
                ->selectRaw("DATE_FORMAT(issue_date, '%Y-%m') as period, SUM(total_amount) as amount")
                ->groupBy('period')
                ->orderBy('period')
                ->get();

            $collectedSeries = $paymentRange
                ->selectRaw("DATE_FORMAT(payment_date, '%Y-%m') as period, SUM(amount) as amount")
                ->groupBy('period')
                ->orderBy('period')
                ->get();

            $invoicesSeries = $invoiceRange
                ->selectRaw("DATE_FORMAT(issue_date, '%Y-%m') as period, COUNT(*) as count")
                ->groupBy('period')
                ->orderBy('period')
                ->get();

            $quotesSeries = $quoteRange
                ->selectRaw("DATE_FORMAT(issue_date, '%Y-%m') as period, COUNT(*) as count")
                ->groupBy('period')
                ->orderBy('period')
                ->get();
        } else {
            $billedSeries = $invoiceRange
                ->selectRaw('DATE(issue_date) as period, SUM(total_amount) as amount')
                ->groupBy('period')
                ->orderBy('period')
                ->get();

            $collectedSeries = $paymentRange
                ->selectRaw('DATE(payment_date) as period, SUM(amount) as amount')
                ->groupBy('period')
                ->orderBy('period')
                ->get();

            $invoicesSeries = $invoiceRange
                ->selectRaw('DATE(issue_date) as period, COUNT(*) as count')
                ->groupBy('period')
                ->orderBy('period')
                ->get();

            $quotesSeries = $quoteRange
                ->selectRaw('DATE(issue_date) as period, COUNT(*) as count')
                ->groupBy('period')
                ->orderBy('period')
                ->get();
        }

        $topClientsRaw = $invoiceRange
            ->selectRaw('client_id, SUM(total_amount) as billed, SUM(amount_paid) as paid, COUNT(*) as invoices_count')
            ->groupBy('client_id')
            ->orderByDesc('billed')
            ->limit(8)
            ->get();

        $clientMap = Client::query()
            ->whereIn('id', $topClientsRaw->pluck('client_id')->filter()->values())
            ->get()
            ->keyBy('id');

        $topClients = $topClientsRaw->map(function ($row) use ($clientMap) {
            $client = $clientMap->get($row->client_id);
            $label = 'Client';
            if ($client) {
                if ($client->type === 'company') {
                    $label = $client->company_name ?: 'Entreprise';
                } else {
                    $fullName = trim(($client->first_name ?: '') . ' ' . ($client->last_name ?: ''));
                    $label = $fullName !== '' ? $fullName : 'Client';
                }
            }

            return [
                'client_id' => $row->client_id,
                'label' => $label,
                'billed' => (float) $row->billed,
                'paid' => (float) $row->paid,
                'invoices_count' => (int) $row->invoices_count,
            ];
        })->values();

        $recentInvoices = $invoiceRange
            ->with(['client'])
            ->orderByDesc('issue_date')
            ->orderByDesc('id')
            ->limit(6)
            ->get(['id', 'invoice_number', 'client_id', 'issue_date', 'total_amount', 'amount_paid', 'status']);

        $recentPayments = $paymentRange
            ->with(['invoice'])
            ->orderByDesc('payment_date')
            ->orderByDesc('id')
            ->limit(6)
            ->get(['id', 'invoice_id', 'amount', 'payment_method', 'payment_date', 'reference_number']);

        $recentQuotes = $quoteRange
            ->with(['client'])
            ->orderByDesc('issue_date')
            ->orderByDesc('id')
            ->limit(6)
            ->get(['id', 'quote_number', 'client_id', 'issue_date', 'total_amount', 'status']);

        return $this->successResponse([
            'filters' => [
                'from' => $from,
                'to' => $to,
                'group_by' => $groupBy,
                'sector_id' => $sectorId,
                'client_id' => $clientId,
            ],
            'summary' => [
                'total_billed' => $totalBilled,
                'total_collected' => $totalCollected,
                'total_paid_on_invoices' => $amountPaidInInvoices,
                'total_outstanding' => $outstanding,
                'collection_rate' => $collectionRate,
                'invoices_count' => $invoicesCount,
                'quotes_count' => $quotesCount,
                'payments_count' => $paymentsCount,
                'clients_count' => $clientsCount,
                'new_clients_count' => $newClientsCount,
                'invoice_status_counts' => [
                    'unpaid' => (int) ($statusCounts['unpaid'] ?? 0),
                    'partial' => (int) ($statusCounts['partial'] ?? 0),
                    'paid' => (int) ($statusCounts['paid'] ?? 0),
                    'cancelled' => (int) ($statusCounts['cancelled'] ?? 0),
                ],
            ],
            'series' => [
                'billed' => $billedSeries,
                'collected' => $collectedSeries,
                'invoices' => $invoicesSeries,
                'quotes' => $quotesSeries,
            ],
            'top_clients' => $topClients,
            'recent' => [
                'invoices' => $recentInvoices,
                'payments' => $recentPayments,
                'quotes' => $recentQuotes,
            ],
        ]);
    }
}
