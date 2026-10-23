<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // ── Eventify: register the admin-only middleware alias ──
        $middleware->alias([
            'is.admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // API requests always get JSON, never an HTML error page.
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson()
        );

        // 401 — missing / invalid token (user, admin or organization guard).
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated. Please log in.',
                ], 401);
            }
        });

        // 403 / 404 / 405 / 429 ... — framework errors in the same envelope
        // as the rest of the API: { success, message }.
        // Generic messages on purpose: the framework's own text can leak
        // internals (e.g. "No query results for model [App\Models\Event]").
        $exceptions->render(function (HttpExceptionInterface $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            $status = $e->getStatusCode();

            $message = match ($status) {
                403 => 'You do not have permission to perform this action.',
                404 => 'Resource not found.',
                405 => 'Method not allowed.',
                429 => 'Too many requests. Please try again later.',
                default => $e->getMessage() ?: 'Request failed.',
            };

            return response()->json([
                'success' => false,
                'message' => $message,
            ], $status, $e->getHeaders());
        });
    })->create();