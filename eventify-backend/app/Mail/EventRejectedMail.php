<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EventRejectedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $organizationName,
        public string $eventTitle,
        public string $reason,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Eventify event was not approved',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.event-rejected',
            with: [
                'organizationName' => $this->organizationName,
                'eventTitle' => $this->eventTitle,
                'reason' => $this->reason,
            ],
        );
    }
}