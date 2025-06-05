<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Shipping;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShippingController extends Controller
{
    public function shippingForm()
    {
        $user = Auth::user();
        $order = Order::where('user_id', $user->id)->first();
        return view('user.shipping.shipping', compact('user', 'order'));
    }

    public function storeShipping(Request $request)
    {
        #users and orders
        $user = Auth::user();
        $order = Order::where('user_id', $user->id)->first();

        $request->validate([
            'city_name' => 'required|string|max:255',
            'zip_code' => 'required|integer',
            'address' => 'required|string|max:255',
            'country' => 'required|string|max:255',
        ]);

        $shipping = Shipping::create([
            'user_id' => $user->id,
            'order_id' => $order ? $order->id : null,   // allow null if no order yet
            'city_name' => $request->city_name,
            'zip_code' => $request->zip_code,
            'address' => $request->address,
            'country' => $request->country,
        ]);


        // return response()->json([
        //     'message' => 'Shipping information saved successfully',
        //     'shipping' => $shipping,
        // ], 201);

        return redirect()->back();
    }

    public function updateShipping(Request $request, $id)
    {
        $user = Auth::user();

        $request->validate([
            'city_name' => 'required|string|max:255',
            'zip_code' => 'required|string|max:10',
            'address' => 'required|string|max:255',
            'country' => 'required|string|max:255',
        ]);

        $shipping = Shipping::where('id', $id)->where('user_id', $user->id)->firstOrFail();

        $shipping->update([
            'city_name' => $request->city_name,
            'zip_code' => $request->zip_code,
            'address' => $request->address,
            'country' => $request->country,
        ]);

        return redirect()->back()->with('success', 'Shipping address updated successfully.');
    }

    public function deleteShipping(Request $request, $id)
    {
        $user = Auth::user();
        $shipping = Shipping::where('id', $id)->where('user_id', $user->id)->firstOrFail();

        $shipping->delete();

        return redirect()->back()->with('success', 'Shipping address deleted successfully.');
    }
}
