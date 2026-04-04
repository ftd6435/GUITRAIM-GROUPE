<?php

namespace App\Mail\Application;

use App\Models\Application;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class ApplicantApplicationConfirmation extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Application $application) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nous avons bien reçu votre candidature'
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.application.applicant_confirmation',
            with: [
                'application' => $this->application,
            ]
        );
    }

    public function attachments(): array
    {
        $attachments = [];

        if ($this->application->cv_file) {
            $cvPath = 'files/applications/cvs/' . $this->application->cv_file;
            if (Storage::disk('public')->exists($cvPath)) {
                $attachments[] = Attachment::fromPath(
                    Storage::disk('public')->path($cvPath)
                )->as('CV-' . $this->application->first_name . '-' . $this->application->last_name . '.' . pathinfo($this->application->cv_file, PATHINFO_EXTENSION));
            }
        }

        if ($this->application->cover_letter_file) {
            $letterPath = 'files/applications/letters/' . $this->application->cover_letter_file;
            if (Storage::disk('public')->exists($letterPath)) {
                $attachments[] = Attachment::fromPath(
                    Storage::disk('public')->path($letterPath)
                )->as('LettreMotivation-' . $this->application->first_name . '-' . $this->application->last_name . '.' . pathinfo($this->application->cover_letter_file, PATHINFO_EXTENSION));
            }
        }

        return $attachments;
    }
}
