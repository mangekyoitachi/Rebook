<?php

namespace App\Http\Controllers;

use App\Events\OrderPlaced;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Shipping;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Notifications\OrderPlacedNotification;
use Illuminate\Support\Facades\Notification;

class OrderController extends Controller
{
    public function storeOrder(Request $request)
    {
        $request->validate([
            'selected_items' => 'required|array|min:1',
            'selected_items.*' => 'exists:products,id',
        ]);

        $user = Auth::user();

        //get the user cart with products
        $cart = Cart::where('user_id', $user->id)->with('products')->first();

        if (!$cart || $cart->products->isEmpty()) {
            return response()->json([
                'message' => 'Cart is empty'
            ]);
        }

        $selectedProductsIds = $request->input('selected_items');

        $selectedProducts = $cart->products->whereIn('id', $selectedProductsIds);

        if ($selectedProducts->isEmpty()) {
            return redirect()->back()->with('error', 'No products selected.');
        }

        $total = $selectedProducts->sum(function ($product) {
            return $product->price * $product->pivot->quantity;
        });

        //create the order

        $order = Order::create([
            'user_id' => $user->id,
            'cart_id' => $cart->id,
            'status' => 'pending',
            'total' => $total
        ]);

        //create the order items

        foreach ($selectedProducts as $product) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $product->pivot->quantity,
                'price' => $product->price,
            ]);
        }

        return redirect()->route('order.show', $order->id)->with('success', 'Order placed successfully.');
    }

    public function showOrder($id)
    {
        $user = Auth::user();

        $order = Order::with('orderItems.product', 'payment', 'shipping')->findOrFail($id);

        $shippings = $user->shippings;

        return view('user.order.order_show', compact('order', 'shippings', 'user'));
    }

    public function cancelOrder($id)
    {
        $order = Order::findOrFail($id);
        if ($order->user_id !== Auth::id()) {
            return redirect()->back()->with('error', 'You are not authorized to cancel this order.');
        }

        //the order is cancelled and the details will be deleted
        $order->orderItems()->delete();
        $order->delete();
        //redirect order
        return redirect()->route('user.dashboard')->with('success', 'Order cancelled successfully.');
    }

    public function storeShipping(Request $request, $id)
    {
        $request->validate([
            'shipping_id' => 'required|exists:shippings,id',
        ]);

        $order = Order::findOrFail($id);

        if ($order->user_id !== Auth::id()) {
            return redirect()->back()->with('error', 'You are not authorized to update this order.');
        }

        // Get the shipping address directly from the database instead of using the relationship
        $shipping = Shipping::where('user_id', Auth::id())
                           ->where('id', $request->shipping_id)
                           ->firstOrFail();

        $order->shipping_id = $shipping->id;
        $order->save();

        return redirect()->route('order.show', $order->id)->with('success', 'Shipping address updated.');
    }

    public function placeOrder(Request $request)
    {
        //Validate and Create Order
        $order = Order::create([
            'user_id' => Auth::id(),
            'total' => $request->input('total'),
        ]);

        //Notify the User
        $user = Auth::user();
        if ($user) {
            Notification::send($user, new OrderPlacedNotification($order));
        }

        // Dispatch the event
        event(new OrderPlaced($order));

        return redirect()->route('order.show', $order->id)
            ->with('success', 'Order placed successfully!');
    }
}