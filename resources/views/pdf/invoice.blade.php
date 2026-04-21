<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        @page { margin: 32px 28px; }
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; color: #0f172a; }
        .text-right { text-align: right; }
        .muted { color: #64748b; }
        .title { font-size: 26px; font-weight: 800; letter-spacing: .6px; color: #0b2f4e; margin: 0; }
        .hr { height: 1px; background: #e2e8f0; margin: 16px 0; }
        .header { display: table; width: 100%; }
        .header .left, .header .right { display: table-cell; vertical-align: top; }
        .header .right { width: 42%; }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 800; background: #e6f1fb; color: #0b2f4e; }
        .box { border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; }
        .grid { display: table; width: 100%; }
        .grid .col { display: table-cell; vertical-align: top; }
        .grid .col + .col { padding-left: 12px; }
        .label { font-size: 10px; text-transform: uppercase; letter-spacing: .6px; color: #64748b; margin-bottom: 4px; }
        .value { font-size: 12px; font-weight: 700; color: #0f172a; }
        table { width: 100%; border-collapse: collapse; margin-top: 14px; }
        thead th { background: #0b2f4e; color: #ffffff; padding: 10px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: .4px; }
        tbody td { padding: 9px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
        tbody tr:nth-child(even) td { background: #f8fafc; }
        .total { margin-top: 14px; display: table; width: 100%; }
        .total .spacer, .total .summary { display: table-cell; vertical-align: top; }
        .total .summary { width: 42%; }
        .summary-row { display: table; width: 100%; margin-top: 6px; }
        .summary-row .k, .summary-row .v { display: table-cell; }
        .summary-row .k { color: #64748b; }
        .summary-row .v { text-align: right; font-weight: 800; }
        .footer { position: fixed; left: 0; right: 0; bottom: -34px; height: 62px; color: #ffffff; }
        .footer .bar { height: 62px; background: #0b2f4e; }
        .footer .content { position: absolute; left: 28px; right: 28px; top: 8px; font-size: 10px; display: table; width: calc(100% - 56px); }
        .footer .content .l, .footer .content .r { display: table-cell; vertical-align: top; }
        .footer .content .r { text-align: right; }
        .footer .legal { font-size: 9px; opacity: 0.92; margin-top: 2px; line-height: 1.2; }
        .watermark { position: fixed; left: -80px; top: 140px; width: 720px; opacity: 0.06; transform: rotate(-20deg); }
        .qr { width: 110px; }
        .nowrap { white-space: nowrap; }
    </style>
</head>
<body>
@php
    $clientName = $invoice->client?->type === 'company'
        ? ($invoice->client?->company_name ?? '')
        : trim(($invoice->client?->first_name ?? '').' '.($invoice->client?->last_name ?? ''));

    $formatMoney = function ($amount) {
        return number_format((float)$amount, 0, ',', ' ');
    };

    $statusLabel = [
        'unpaid' => 'IMPAYÉE',
        'partial' => 'PARTIELLE',
        'paid' => 'PAYÉE',
        'cancelled' => 'ANNULÉE',
    ][$invoice->status] ?? strtoupper((string)$invoice->status);

    $senderAddress = $settings?->address;
    $senderEmail = $settings?->email;
    $senderPhone = $settings?->phone;

    $legalRccm = trim((string)($settings?->legal_rccm ?? ''));
    $legalNif = trim((string)($settings?->legal_nif ?? ''));
    $bankAccountNumber = trim((string)($settings?->bank_account_number ?? ''));

    $legalParts = [];
    if ($legalRccm !== '') $legalParts[] = 'RCCM: '.$legalRccm;
    if ($legalNif !== '') $legalParts[] = 'NIF: '.$legalNif;
    if ($bankAccountNumber !== '') $legalParts[] = 'Compte bancaire: '.$bankAccountNumber;
    $legalLine = implode(' · ', $legalParts);
@endphp

<img class="watermark" src="data:image/png;base64,{{ $watermarkBase64 }}" alt="">

<div class="header">
    <div class="left">
        <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('img/dark_logo.png'))) }}" alt="Guitraim" style="height:48px;">
        <div style="margin-top: 8px;">
            <div class="title">FACTURE</div>
            <div style="margin-top: 4px;">
                <span class="badge">{{ $statusLabel }}</span>
            </div>
        </div>
    </div>
    <div class="right text-right">
        <div class="label">Date</div>
        <div class="value">{{ $invoice->issue_date?->format('d/m/Y') }}</div>
        <div style="height: 10px;"></div>
        <div class="label">Facture N°</div>
        <div class="value">{{ $invoice->invoice_number }}</div>
        @if($invoice->due_date)
            <div style="height: 10px;"></div>
            <div class="label">Échéance</div>
            <div class="value">{{ $invoice->due_date?->format('d/m/Y') }}</div>
        @endif
        @if($invoice->quote)
            <div style="height: 10px;"></div>
            <div class="label">Devis lié</div>
            <div class="value">{{ $invoice->quote->quote_number }}</div>
        @endif
    </div>
</div>

<div class="hr"></div>

<div class="grid">
    <div class="col box">
        <div class="label">Émetteur</div>
        <div class="value">GUITRAIM GROUPE</div>
        <div class="muted" style="margin-top: 6px; line-height: 1.45;">
            @if($senderAddress) {{ $senderAddress }}<br> @endif
            @if($senderEmail) {{ $senderEmail }}<br> @endif
            @if($senderPhone) {{ $senderPhone }} @endif
        </div>
        <div style="margin-top: 8px;" class="muted">
            Secteur: <span class="value" style="font-size: 12px;">{{ $invoice->sector?->name }}</span>
        </div>
    </div>
    <div class="col box">
        <div class="label">Destinataire</div>
        <div class="value">{{ $clientName ?: 'Client' }}</div>
        <div class="muted" style="margin-top: 6px; line-height: 1.45;">
            @if($invoice->client?->phone) {{ $invoice->client->phone }}<br> @endif
            @if($invoice->client?->email) {{ $invoice->client->email }}<br> @endif
            @if($invoice->client?->address) {{ $invoice->client->address }} @endif
        </div>
        @if($invoice->client?->tax_id)
            <div style="margin-top: 8px;" class="muted">
                Identifiant: <span class="value" style="font-size: 12px;">{{ $invoice->client->tax_id }}</span>
            </div>
        @endif
    </div>
</div>

<table>
    <thead>
        <tr>
            <th style="text-align:left;">Description</th>
            <th class="text-right nowrap">Prix Unitaire</th>
            <th class="text-right nowrap">Quantité</th>
            <th class="text-right nowrap">Total</th>
        </tr>
    </thead>
    <tbody>
        @foreach($invoice->items as $item)
            <tr>
                <td style="width: 52%;">
                    <div style="font-weight: 700;">{{ $item->description }}</div>
                    @if($item->unit)
                        <div class="muted" style="margin-top: 2px;">Unité: {{ $item->unit }}</div>
                    @endif
                </td>
                <td class="text-right nowrap" style="width: 16%;">{{ $formatMoney($item->unit_price) }} GNF</td>
                <td class="text-right nowrap" style="width: 16%;">{{ rtrim(rtrim(number_format((float)$item->quantity, 2, ',', ' '), '0'), ',') }}</td>
                <td class="text-right nowrap" style="width: 16%; font-weight: 800;">{{ $formatMoney($item->total) }} GNF</td>
            </tr>
        @endforeach
    </tbody>
</table>

<div class="total">
    <div class="spacer">
        @if($invoice->notes)
            <div class="box">
                <div class="label">Notes</div>
                <div style="white-space: pre-wrap; line-height: 1.5;">{{ $invoice->notes }}</div>
            </div>
        @endif
    </div>
    <div class="summary">
        <div class="box">
            <div class="summary-row">
                <div class="k">Sous-total</div>
                <div class="v">{{ $formatMoney($invoice->subtotal) }} GNF</div>
            </div>
            <div class="summary-row">
                <div class="k">Taxes</div>
                <div class="v">{{ $formatMoney($invoice->tax_amount) }} GNF</div>
            </div>
            <div class="summary-row" style="margin-top: 10px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
                <div class="k" style="font-weight: 800; color: #0b2f4e;">TOTAL</div>
                <div class="v" style="font-size: 14px; color: #0b2f4e;">{{ $formatMoney($invoice->total_amount) }} GNF</div>
            </div>
            <div class="summary-row" style="margin-top: 8px;">
                <div class="k">Payé</div>
                <div class="v">{{ $formatMoney($invoice->amount_paid) }} GNF</div>
            </div>
            <div class="summary-row">
                <div class="k">Solde</div>
                <div class="v">{{ $formatMoney(((float)$invoice->total_amount) - ((float)$invoice->amount_paid)) }} GNF</div>
            </div>

            <div style="margin-top: 12px; display: table; width: 100%;">
                <div style="display: table-cell; vertical-align: top;">
                    <div class="label">Vérification</div>
                    <div class="muted" style="font-size: 10px; line-height: 1.35;">
                        Scannez le QR ou visitez:<br>
                        {{ $verifyUrl }}
                    </div>
                </div>
                <div style="display: table-cell; width: 120px; text-align: right; vertical-align: top;">
                    <img class="qr" src="{{ $qrDataUri }}" alt="QR">
                </div>
            </div>
        </div>
    </div>
</div>

<div class="footer">
    <div class="bar"></div>
    <div class="content">
        <div class="l">
            www.guitraim-groupe.com
            @if($legalLine)
                <div class="legal">{{ $legalLine }}</div>
            @endif
        </div>
        <div class="r">
            {{ $invoice->invoice_number }} · {{ $invoice->issue_date?->format('d/m/Y') }}
        </div>
    </div>
</div>
</body>
</html>
