<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Sent to the NEW address: the email only changes once its owner
 * opens the link.
 */
class EmailChangeConfirmMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $confirmLink)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Confirm Your New Eventify Email');
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.email-change-confirm',
            with: ['confirmLink' => $this->confirmLink],
        );
    }
}