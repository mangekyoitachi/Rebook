<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Exception;
use App\Services\GoogleAuthService;

class GoogleController extends Controller
{
    public function __construct(private GoogleAuthService $googleAuth) {}

    public function redirectToGoogle()
    {
        return $this->googleAuth->redirectToGoogle();
    }

    // ADD THIS MISSING METHOD:
    public function handleGoogleCallback()
    {
        return $this->googleAuth->handleGoogleCallback();
    }
}
