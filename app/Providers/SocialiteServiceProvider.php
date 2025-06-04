<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Socialite\Facades\Socialite;
use App\Services\GoogleAuthService;

class SocialiteServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
      public function register(): void
    {
        // Register the main Socialite service provider
        $this->app->singleton(GoogleAuthService::class, function ($app) {
        return new GoogleAuthService();
    });
    }

    public function boot(): void
    {
        // Your custom Google configuration if needed
        Socialite::extend('google', function ($app) {
            $config = $app['config']['services.google'];
            return Socialite::buildProvider(\Laravel\Socialite\Two\GoogleProvider::class, $config);
        });
    }
}
