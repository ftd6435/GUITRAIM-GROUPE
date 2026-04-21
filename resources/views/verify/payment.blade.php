<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Vérification Reçu</title>
    <style>
        body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; margin: 0; background: #f8fafc; color: #0f172a; }
        .wrap { max-width: 920px; margin: 28px auto; padding: 0 16px; }
        .card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; }
        .top { padding: 18px 18px 14px; background: #0b2f4e; color: #ffffff; display: flex; align-items: center; gap: 12px; }
        .top img { height: 34px; }
        .title { font-size: 16px; font-weight: 800; letter-spacing: .4px; }
        .content { padding: 18px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
        .box { border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; }
        .label { font-size: 12px; text-transform: uppercase; letter-spacing: .4px; color: #64748b; margin-bottom: 6px; }
        .value { font-size: 14px; font-weight: 800; }
        .muted { color: #64748b; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 800; background: #e6f1fb; color: #0b2f4e; }
    </style>
</head>
<body>
@php
    $client = $invoice?->client;
    $clientName = $client?->type === 'company'
        ? ($client?->company_name ?? '')
        : trim(($client?->first_name ?? '').' '.($client?->last_name ?? ''));

    $methodLabel = [
        'cash' => 'Espèces',
        'bank_transfer' => 'Virement',
        'check' => 'Chèque',
        'mobile_money' => 'Mobile Money',
    ][(string)($payment->payment_method ?? '')] ?? ($payment->payment_method ?: '—');

    $receiptNumber = 'REC-' . $payment->created_at?->format('Y') . '-' . str_pad((string)$payment->id, 6, '0', STR_PAD_LEFT);
@endphp

<div class="wrap">
    <div class="card">
        <div class="top">
            <img src="/img/white_logo.png" alt="Guitraim">
            <div>
                <div class="title">Vérification du reçu de paiement</div>
                <div class="muted" style="color: rgba(255,255,255,.85); font-size: 12px;">
                    {{ $receiptNumber }} · {{ $invoice?->invoice_number }}
                </div>
            </div>
        </div>
        <div class="content">
            <div class="grid">
                <div class="box">
                    <div class="label">Facture</div>
                    <div class="value">{{ $invoice?->invoice_number ?: '—' }}</div>
                    @if($invoice?->issue_date)
                        <div class="muted" style="margin-top: 6px;">Date facture: {{ $invoice->issue_date?->format('d/m/Y') }}</div>
                    @endif
                    @if($invoice?->sector)
                        <div class="muted" style="margin-top: 6px;">Secteur: {{ $invoice->sector?->name }}</div>
                    @endif
                </div>
                <div class="box">
                    <div class="label">Paiement</div>
                    <div class="value">{{ number_format((float)$payment->amount, 0, ',', ' ') }} GNF</div>
                    <div class="muted" style="margin-top: 6px;">
                        Date: {{ $payment->payment_date?->format('d/m/Y') }} · Méthode: {{ $methodLabel }}
                    </div>
                    <div class="muted" style="margin-top: 6px;">Référence: {{ $payment->reference_number ?: '—' }}</div>
                </div>
                <div class="box">
                    <div class="label">Client</div>
                    <div class="value">{{ $clientName ?: 'Client' }}</div>
                    <div class="muted" style="margin-top: 6px;">
                        @if($client?->phone) {{ $client->phone }} @endif
                        @if($client?->email) · {{ $client->email }} @endif
                    </div>
                </div>
                <div class="box">
                    <div class="label">Statut facture</div>
                    <div class="value">
                        <span class="badge">{{ strtoupper((string)($invoice?->status ?? '—')) }}</span>
                    </div>
                    @if($invoice)
                        <div class="muted" style="margin-top: 6px;">
                            Total: {{ number_format((float)$invoice->total_amount, 0, ',', ' ') }} GNF · Payé: {{ number_format((float)$invoice->amount_paid, 0, ',', ' ') }} GNF
                        </div>
                    @endif
                </div>
            </div>

            @if($payment->notes)
                <div class="box" style="margin-top: 14px;">
                    <div class="label">Notes</div>
                    <div style="white-space: pre-wrap;">{{ $payment->notes }}</div>
                </div>
            @endif
        </div>
    </div>
</div>
</body>
</html>
