<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
  public function index()
  {
      $user = Auth::user();
      $notifications = $user->unreadNotifications;
      
      // Mark notifications as read
      return view('user.dashboard', compact('user', 'notifications'));
  }
}
