<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Notifications\OrderPlacedNotification;
use inertia\Inertia;

class ProfileController extends Controller
{
    
    public function showProfile()
    {
        // $user = Auth::user();
        // //this will also fetch user's orders
        // $orders = Order::where('user_id', $user->id)
        // ->with('payment', 'shipping', 'orderItems.product')->get();

        // $user->load('shippings');

        // // return view('user.profile.show', compact('user', 'orders'));

        $user = Auth::user();
        $orders = Order::where('user_id',$user->id)
        ->with('payment', 'shipping', 'orderItems.product')->get();

        $orderItems = OrderItem::all();
        $products = Product::all();

        // $user->load();

        return inertia::render('Profile/Profile', [
            'user' => $user,
            'orders' => $orders,
            'orderItems' => $orderItems,
            'products' => $products,
        ]);

    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'image' => $request->file('image') ? $request->file('image')->store('images/users', 'public') : $user->image,
        ]);
        return redirect()->route('user.profile')->with('success', 'Profile updated successfully.');

    }

}
