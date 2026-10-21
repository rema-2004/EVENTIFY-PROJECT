<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Traits\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    use ApiResponse;

    /**
     * Blocks any request where the authenticated user is not an admin.
     * Must run AFTER auth:sanctum (so Auth::user() is already resolved).
     *
     * auth:sanctum also accepts organization tokens, and an Organization
     * has no isAdmin() — so the account type is checked first.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user instanceof User || ! $user->isAdmin()) {
            return $this->error('Forbidden. Admin access required.', 403);
        }

        return $next($request);
    }
}