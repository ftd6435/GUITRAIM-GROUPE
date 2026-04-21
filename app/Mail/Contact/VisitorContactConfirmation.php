<?php

namespace App\Mail\Contact;

use App\Models\Contact;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VisitorContactConfirmation extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $tries = 5;
    public $backoff = [30, 60, 120, 300];

    public function __construct(public Contact $contact)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nous avons bien reçu votre message'
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contact.visitor_confirmation',
            with: [
                'contact' => $this->contact,
            ]
        );
    }
}
