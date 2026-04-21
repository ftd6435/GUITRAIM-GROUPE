<?php

namespace App\Mail\Newsletter;

use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerifyNewsletterSubscription extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $tries = 5;
    public $backoff = [30, 60, 120, 300];

    public function __construct(
        public NewsletterSubscriber $subscriber,
        public string $verificationUrl
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Confirmez votre inscription à la newsletter'
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.newsletter.verify',
            with: [
                'subscriber' => $this->subscriber,
                'verificationUrl' => $this->verificationUrl,
            ]
        );
    }
}

