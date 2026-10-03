<?php

namespace App\Traits;

use App\Mail\PasswordResetMail;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

trait HandlesPasswordReset
{
    /**
     * Creates a reset token, stores it (hashed), and delivers the reset link.
     * Uses MAIL_MAILER=log during local dev — no code change needed for
     * production, just flip MAIL_MAILER in .env once SMTP is configured.
     */
    protected function createAndDeliverResetToken(
        string $table,
        string $email,
        string $frontendResetPath
    ): void {
        $token = Str::random(64);

        DB::table($table)->updateOrInsert(
            ['email' => $email],
            [
                'token' => Hash::make($token),
                'created_at' => now(),
            ]
        );

        $resetLink = $frontendResetPath . '?' . http_build_query([
            'token' => $token,
            'email' => $email,
        ]);

        Mail::to($email)->send(new PasswordResetMail($resetLink));
    }

    /**
     * Validates the submitted token against the stored hash,
     * enforces the expiry window, and cleans up if expired.
     */
    protected function isResetTokenValid(
        string $table,
        string $email,
        string $token,
        int $expiryMinutes = 60
    ): bool {
        $record = DB::table($table)->where('email', $email)->first();

        if (! $record) {
            return false;
        }

        // DB::table() returns a raw stdClass — created_at is a plain
        // string here, NOT a Carbon instance, so it must be parsed
        // explicitly before using Carbon comparison methods.
        $createdAt = Carbon::parse($record->created_at);

        if ($createdAt->lt(now()->subMinutes($expiryMinutes))) {
            DB::table($table)->where('email', $email)->delete();
            return false;
        }

        return Hash::check($token, $record->token);
    }

    protected function deleteResetToken(string $table, string $email): void
    {
        DB::table($table)->where('email', $email)->delete();
    }
}