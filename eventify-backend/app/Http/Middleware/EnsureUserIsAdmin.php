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
     */
    public function handle(Request $request, Closure $next): Response
    {
        /** @var User|null $user */
        $user = $request->user();

        if (! $user || ! $user->isAdmin()) {
            return $this->error('Forbidden. Admin access required.', 403);
        }

        return $next($request);
    }
}