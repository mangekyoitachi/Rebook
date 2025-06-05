<?php

namespace App\Providers;

use App\Models\User;
use App\Policies\AdminPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{

    protected $policies = [
        User::class => AdminPolicy::class,
    ];
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Define gates for admin actions
        Gate::define('access-admin-dashboard', [AdminPolicy::class, 'viewAdminDashboard']);
        Gate::define('access-admin-category', [AdminPolicy::class, 'accessAdminCategory']);
        Gate::define('create-category', [AdminPolicy::class, 'createCateogory']);
        Gate::define('update-category', [AdminPolicy::class, 'updateCategory']);
        Gate::define('delete-category', [AdminPolicy::class, 'deleteCategory']);
        Gate::define('view-user-data', [AdminPolicy::class, 'viewUserData']);
    }
}
