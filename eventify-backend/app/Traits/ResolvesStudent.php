<?php

namespace App\Traits;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

/**
 * The logged-in student, or null when the token belongs to someone else
 * (for example an organization). Controllers that only serve students
 * return their own 403 message when this is null.
 */
trait ResolvesStudent
{
    private function student(): ?User
    {
        $user = Auth::user();

        return $user instanceof User ? $user : null;
    }
}
