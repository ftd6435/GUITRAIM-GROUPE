<!doctype html>
<html lang="fr">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        @page {
            margin: 32px 28px;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #0f172a;
        }

        .text-right {
            text-align: right;
        }

        .muted {
            color: #64748b;
        }

        .title {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: .6px;
            color: #0b2f4e;
            margin: 0;
        }

        .hr {
            height: 1px;
            background: #e2e8f0;
            margin: 16px 0;
        }

        .header {
            display: table;
            width: 100%;
        }

        .header .left,
        .header .right {
            display: table-cell;
            vertical-align: top;
        }

        .header .right {
            width: 44%;
        }

        .badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 800;
            background: #e6f1fb;
            color: #0b2f4e;
        }

        .box {
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 12px;
        }

        .grid {
            display: table;
            width: 100%;
        }

        .grid .col {
            display: table-cell;
            vertical-align: top;
        }

        .grid .col+.col {
            padding-left: 12px;
        }

        .label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: .6px;
            color: #64748b;
            margin-bottom: 4px;
        }

        .value {
            font-size: 12px;
            font-weight: 700;
            color: #0f172a;
        }

        .row {
            display: table;
            width: 100%;
            margin-top: 6px;
        }

        .row .k,
        .row .v {
            display: table-cell;
        }

        .row .k {
            color: #64748b;
        }

        .row .v {
            text-align: right;
            font-weight: 800;
        }

        .footer {
            position: fixed;
            left: 0;
            right: 0;
            bottom: -34px;
            height: 62px;
            color: #ffffff;
        }

        .footer .bar {
            height: 62px;
            background: #0b2f4e;
        }

        .footer .content {
            position: absolute;
            left: 28px;
            right: 28px;
            top: 8px;
            font-size: 10px;
            display: table;
            width: calc(100% - 56px);
        }

        .footer .content .l,
        .footer .content .r {
            display: table-cell;
            vertical-align: top;
        }

        .footer .content .r {
            text-align: right;
        }

        .footer .legal {
            font-size: 9px;
            opacity: 0.92;
            margin-top: 2px;
            line-height: 1.2;
        }

        .watermark {
            position: fixed;
            left: -80px;
            top: 160px;
            width: 720px;
            opacity: 0.06;
            transform: rotate(-20deg);
        }

        .qr {
            width: 110px;
        }

        .nowrap {
            white-space: nowrap;
        }
    </style>
</head>

<body>
    @php
        $client = $invoice?->client;
        $clientName =
            $client?->type === 'company'
                ? $client?->company_name ?? ''
                : trim(($client?->first_name ?? '') . ' ' . ($client?->last_name ?? ''));

        $formatMoney = function ($amount) {
            return number_format((float) $amount, 0, ',', ' ');
        };

        $methodLabel =
            [
                'cash' => 'Espèces',
                'bank_transfer' => 'Virement',
                'check' => 'Chèque',
                'mobile_money' => 'Mobile Money',
            ][(string) ($payment->payment_method ?? '')] ?? ($payment->payment_method ?: '—');

        $senderAddress = $settings?->address;
        $senderEmail = $settings?->email;
        $senderPhone = $settings?->phone;

        $legalRccm = trim((string) ($settings?->legal_rccm ?? ''));
        $legalNif = trim((string) ($settings?->legal_nif ?? ''));
        $bankAccountNumber = trim((string) ($settings?->bank_account_number ?? ''));

        $legalParts = [];
        if ($legalRccm !== '') {
            $legalParts[] = 'RCCM: ' . $legalRccm;
        }
        if ($legalNif !== '') {
            $legalParts[] = 'NIF: ' . $legalNif;
        }
        if ($bankAccountNumber !== '') {
            $legalParts[] = 'Compte bancaire: ' . $bankAccountNumber;
        }
        $legalLine = implode(' · ', $legalParts);

        $receiptNumber = 'REC-' . now()->format('Y') . '-' . str_pad((string) $payment->id, 6, '0', STR_PAD_LEFT);
        $total = (float) ($invoice?->total_amount ?? 0);
        $paid = (float) ($invoice?->amount_paid ?? 0);
        $balance = $total - $paid;
    @endphp

    <img class="watermark" src="data:image/png;base64,{{ $watermarkBase64 }}" alt="">

    <div class="header">
        <div class="left">
            <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('img/dark_logo.png'))) }}"
                alt="Guitraim" style="height:48px;">
            <div style="margin-top: 8px;">
                <div class="title">REÇU DE PAIEMENT</div>
                <div style="margin-top: 4px;">
                    <span class="badge">{{ $receiptNumber }}</span>
                </div>
            </div>
        </div>
        <div class="right text-right">
            <div class="label">Date de paiement</div>
            <div class="value">{{ $payment->payment_date?->format('d/m/Y') }}</div>
            <div style="height: 10px;"></div>
            <div class="label">Facture</div>
            <div class="value">{{ $invoice?->invoice_number }}</div>
        </div>
    </div>

    <div class="hr"></div>

    <div class="grid">
        <div class="col box">
            <div class="label">Émetteur</div>
            <div class="value">GUITRAIM GROUPE</div>
            <div class="muted" style="margin-top: 6px; line-height: 1.45;">
                @if ($senderAddress)
                    {{ $senderAddress }}<br>
                @endif
                @if ($senderEmail)
                    {{ $senderEmail }}<br>
                @endif
                @if ($senderPhone)
                    {{ $senderPhone }}
                @endif
            </div>
        </div>
        <div class="col box">
            <div class="label">Reçu de</div>
            <div class="value">{{ $clientName ?: 'Client' }}</div>
            <div class="muted" style="margin-top: 6px; line-height: 1.45;">
                @if ($client?->phone)
                    {{ $client->phone }}<br>
                @endif
                @if ($client?->email)
                    {{ $client->email }}<br>
                @endif
                @if ($client?->address)
                    {{ $client->address }}
                @endif
            </div>
        </div>
    </div>

    <div style="height: 14px;"></div>

    <div class="box">
        <div class="label">Détails du paiement</div>
        <div class="row">
            <div class="k">Montant</div>
            <div class="v">{{ $formatMoney($payment->amount) }} GNF</div>
        </div>
        <div class="row">
            <div class="k">Méthode</div>
            <div class="v">{{ $methodLabel }}</div>
        </div>
        <div class="row">
            <div class="k">Référence</div>
            <div class="v">{{ $payment->reference_number ?: '—' }}</div>
        </div>
        @if ($payment->notes)
            <div style="margin-top: 10px;" class="muted">
                {{ $payment->notes }}
            </div>
        @endif
    </div>

    <div style="height: 14px;"></div>

    <div class="box">
        <div class="label">Récapitulatif facture</div>
        <div class="row">
            <div class="k">Total facture</div>
            <div class="v">{{ $formatMoney($total) }} GNF</div>
        </div>
        <div class="row">
            <div class="k">Total payé</div>
            <div class="v">{{ $formatMoney($paid) }} GNF</div>
        </div>
        <div class="row" style="margin-top: 10px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
            <div class="k" style="font-weight: 800; color: #0b2f4e;">Solde restant</div>
            <div class="v" style="font-size: 14px; color: #0b2f4e;">{{ $formatMoney(max($balance, 0)) }} GNF</div>
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

    <div class="footer">
        <div class="bar"></div>
        <div class="content">
            <div class="l">
                www.guitraim-groupe.com
                @if ($legalLine)
                    <div class="legal">{{ $legalLine }}</div>
                @endif
            </div>
            <div class="r">
                {{ $invoice?->invoice_number }} · {{ $payment->payment_date?->format('d/m/Y') }}
            </div>
        </div>
    </div>
</body>

</html>
