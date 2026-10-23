<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // One limiter for every sensitive endpoint (see config/eventify.php).
        RateLimiter::for('auth', fn (Request $request) => Limit::perMinute(
            config('eventify.auth_throttle_per_minute')
        )->by($request->ip()));
    }
}
