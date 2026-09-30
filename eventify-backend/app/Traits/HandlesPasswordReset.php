<?php

namespace App\Traits;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

trait HandlesPasswordReset
{
    /**
     * Creates a reset token, stores it (hashed) in the given table,
     * and "delivers" the reset link.
     *
     * TODO (end of project): replace the Log::info() call with an actual
     * Mail::to($email)->send(new PasswordResetMail($link)) once SMTP is
     * configured. Everything else in this flow stays the same.
     */
    protected function createAndLogResetToken(string $table, string $email, string $frontendResetPath): void
    {
        $token = Str::random(64);

        DB::table($table)->updateOrInsert(
            ['email' => $email],
            [
                'token' => Hash::make($token),
                'created_at' => now(),
            ]
        );

        $resetLink = "{$frontendResetPath}?token={$token}&email=" . urlencode($email);

        // TEMPORARY: logged instead of emailed, per project decision.
        Log::info('[Password Reset Link] ' . $resetLink);
    }

    /**
     * Validates a submitted token against the stored (hashed) one,
     * and enforces the expiry window. Returns true if valid.
     */
    protected function isResetTokenValid(string $table, string $email, string $token, int $expiryMinutes = 60): bool
    {
        $record = DB::table($table)->where('email', $email)->first();

        if (! $record) {
            return false;
        }

        if (now()->diffInMinutes($record->created_at) > $expiryMinutes) {
            return false;
        }

        return Hash::check($token, $record->token);
    }

    protected function deleteResetToken(string $table, string $email): void
    {
        DB::table($table)->where('email', $email)->delete();
    }
}