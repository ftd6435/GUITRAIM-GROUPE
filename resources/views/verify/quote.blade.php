<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Vérification Devis</title>
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
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th { text-align: left; font-size: 12px; color: #334155; border-bottom: 1px solid #e2e8f0; padding: 10px 8px; }
        td { border-bottom: 1px solid #f1f5f9; padding: 10px 8px; vertical-align: top; }
        .right { text-align: right; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 800; background: #e6f1fb; color: #0b2f4e; }
        .muted { color: #64748b; }
    </style>
</head>
<body>
@php
    $clientName = $quote->client?->type === 'company'
        ? ($quote->client?->company_name ?? '')
        : trim(($quote->client?->first_name ?? '').' '.($quote->client?->last_name ?? ''));
@endphp

<div class="wrap">
    <div class="card">
        <div class="top">
            <img src="/img/white_logo.png" alt="Guitraim">
            <div>
                <div class="title">Vérification du devis</div>
                <div class="muted" style="color: rgba(255,255,255,.85); font-size: 12px;">{{ $quote->quote_number }}</div>
            </div>
        </div>
        <div class="content">
            <div class="grid">
                <div class="box">
                    <div class="label">Statut</div>
                    <div class="value"><span class="badge">{{ strtoupper($quote->status) }}</span></div>
                </div>
                <div class="box">
                    <div class="label">Date</div>
                    <div class="value">{{ $quote->issue_date?->format('d/m/Y') }}</div>
                </div>
                <div class="box">
                    <div class="label">Client</div>
                    <div class="value">{{ $clientName ?: 'Client' }}</div>
                    <div class="muted" style="margin-top: 6px;">
                        @if($quote->client?->phone) {{ $quote->client->phone }} @endif
                        @if($quote->client?->email) · {{ $quote->client->email }} @endif
                    </div>
                </div>
                <div class="box">
                    <div class="label">Secteur</div>
                    <div class="value">{{ $quote->sector?->name }}</div>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th class="right">Quantité</th>
                        <th class="right">PU</th>
                        <th class="right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($quote->items as $item)
                        <tr>
                            <td>
                                <div style="font-weight: 700;">{{ $item->description }}</div>
                                @if($item->unit)
                                    <div class="muted">Unité: {{ $item->unit }}</div>
                                @endif
                            </td>
                            <td class="right">{{ rtrim(rtrim(number_format((float)$item->quantity, 2, ',', ' '), '0'), ',') }}</td>
                            <td class="right">{{ number_format((float)$item->unit_price, 0, ',', ' ') }} GNF</td>
                            <td class="right" style="font-weight: 800;">{{ number_format((float)$item->total, 0, ',', ' ') }} GNF</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            <div style="display:flex; justify-content:flex-end; margin-top: 12px;">
                <div class="box" style="min-width: 280px;">
                    <div class="label">Total</div>
                    <div class="value">{{ number_format((float)$quote->total_amount, 0, ',', ' ') }} GNF</div>
                </div>
            </div>

            @if($quote->notes)
                <div class="box" style="margin-top: 14px;">
                    <div class="label">Notes</div>
                    <div style="white-space: pre-wrap;">{{ $quote->notes }}</div>
                </div>
            @endif
        </div>
    </div>
</div>
</body>
</html>

