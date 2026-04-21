<?php

namespace App\Mail\Contact;

use App\Models\Contact;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminContactReceived extends Mailable implements ShouldQueue
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
            subject: 'Nouveau message de contact - ' . $this->contact->full_name
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contact.admin_received',
            with: [
                'contact' => $this->contact,
            ]
        );
    }
}
