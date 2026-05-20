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

class AdminApplicationReceived extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $tries = 5;
    public $backoff = [30, 60, 120, 300];

    public function __construct(public Application $application) {}

    public function envelope(): Envelope
    {
        $name = trim(($this->application->first_name ?? '') . ' ' . ($this->application->last_name ?? ''));
        $jobTitle = $this->application->job?->title;
        $suffix = $jobTitle ? ' - ' . $jobTitle : '';

        return new Envelope(
            subject: 'Nouvelle candidature - ' . ($name ?: 'Candidat') . $suffix
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.application.admin_received',
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
            if (Storage::disk('r2')->exists($cvPath)) {
                $attachments[] = Attachment::fromStorageDisk('r2', $cvPath)
                    ->as('CV-' . $this->application->first_name . '-' . $this->application->last_name . '.' . pathinfo($this->application->cv_file, PATHINFO_EXTENSION));
            }
        }

        if ($this->application->cover_letter_file) {
            $letterPath = 'files/applications/letters/' . $this->application->cover_letter_file;
            if (Storage::disk('r2')->exists($letterPath)) {
                $attachments[] = Attachment::fromStorageDisk('r2', $letterPath)
                    ->as('LettreMotivation-' . $this->application->first_name . '-' . $this->application->last_name . '.' . pathinfo($this->application->cover_letter_file, PATHINFO_EXTENSION));
            }
        }

        return $attachments;
    }
}
