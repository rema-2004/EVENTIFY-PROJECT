<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Sent to the OLD address, so the real owner knows a change was asked for.
 */
class EmailChangeNoticeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $newEmail)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'A Change Of Your Eventify Email Was Requested');
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.email-change-notice',
            with: ['newEmail' => $this->newEmail],
        );
    }
}