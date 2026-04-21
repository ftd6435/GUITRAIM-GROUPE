<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use App\Models\Invoice;
use App\Models\Payment;

class VerifyDocumentController extends Controller
{
    public function quote($uuid)
    {
        $quote = Quote::query()
            ->with(['client', 'sector', 'items'])
            ->where('uuid', $uuid)
            ->firstOrFail();

        return view('verify.quote', [
            'quote' => $quote,
        ]);
    }

    public function invoice($uuid)
    {
        $invoice = Invoice::query()
            ->with(['client', 'sector', 'quote', 'items', 'payments'])
            ->where('uuid', $uuid)
            ->firstOrFail();

        return view('verify.invoice', [
            'invoice' => $invoice,
        ]);
    }

    public function payment($id)
    {
        $payment = Payment::query()
            ->with(['invoice.client', 'invoice.sector', 'invoice.quote'])
            ->findOrFail($id);

        return view('verify.payment', [
            'payment' => $payment,
            'invoice' => $payment->invoice,
        ]);
    }
}
