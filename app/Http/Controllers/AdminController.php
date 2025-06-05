<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class AdminController extends Controller
{
    use AuthorizesRequests;
    /**
     * Show the admin dashboard.
     *
     * @return \Illuminate\View\View
     */
    public function adminDashboard()
    {
        $this->authorize('access-admin-dashboard', Auth::user());
        return view('admin.dashboard');
    }

    public function createAdminCategory()
    {
        
    }
}
