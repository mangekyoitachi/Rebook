<?php

namespace App\Services;

use App\Models\User;
use Exception;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class GoogleAuthService
{
      public function redirectToGoogle()
    {
        try {
            Log::info('Redirecting to Google OAuth');
            return Socialite::driver('google')->redirect();
        } catch (Exception $e) {
            Log::error('Google OAuth redirect error: ' . $e->getMessage());
            return redirect('/login')->with('error', 'Unable to connect to Google. Please try again.');
        }
    }

    public function handleGoogleCallback() // Make sure this method exists!
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            // Find existing user by email
            $existingUser = User::where('email', $googleUser->getEmail())->first();

            if ($existingUser) {
                // Update existing user
                $existingUser->update([
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'email_verified_at' => $existingUser->email_verified_at ?? now(),
                ]);
                $user = $existingUser;
            } else {
                // Create new user
                $userData = [
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'email_verified_at' => now(),
                ];

                try {
                    $user = User::create($userData);
                } catch (Exception $e) {
                    $userData['password'] = '';
                    $user = User::create($userData);
                }
            }

            Auth::login($user, true);
            return redirect()->intended('/dashboard')->with('success', 'Successfully logged in with Google!');

        } catch (Exception $e) {
            Log::error('Google OAuth callback error: ' . $e->getMessage());
            return redirect('/login')->with('error', 'Google authentication failed. Please try again.');
        }
    }
}
