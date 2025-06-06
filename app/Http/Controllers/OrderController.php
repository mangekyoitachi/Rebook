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
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Event;

class OrderController extends Controller
{
    public function storeOrder(Request $request)
    {
        $request->validate([
            'selected_items' => 'required|array|min:1',
            'selected_items.*' => 'exists:products,id',
            'shipping_address_id' => 'required|exists:shippings,id', // Ensure shipping address is provided
        ]);

        $user = Auth::user();

        $cart = Cart::where('user_id', $user->id)->with('products.seller')->first();

        if (!$cart || $cart->products->isEmpty()) {
            return response()->json([
                'message' => 'Cart is empty'
            ]);
        }

        $selectedProductIds = $request->input('selected_items');
        $selectedProducts = $cart->products->whereIn('id', $selectedProductIds);

        if ($selectedProducts->isEmpty()) {
            return redirect()->back()->with('error', 'No products selected.');
        }

        // Group selected products by seller
        $productsBySeller = $selectedProducts->groupBy('seller_id');

        foreach ($productsBySeller as $sellerId => $products) {
            $total = $products->sum(function ($product) {
                return $product->price * $product->pivot->quantity;
            });

            // Create a new order for each seller
            $order = Order::create([
                'user_id' => $user->id,
                'cart_id' => $cart->id,
                'seller_id' => $sellerId, // Associate the order with the seller
                'status' => 'pending',
                'total' => $total,
                'shipping_address_id' => $request->shipping_address_id, // Apply the same shipping address to all orders for now
            ]);

            // Eager load the user relationship immediately after creating the order
            $order->load('user');

            // Create order items for the products in this seller's group
            foreach ($products as $product) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $product->pivot->quantity,
                    'price' => $product->price,
                ]);

                // Remove the product from the cart
                $cart->products()->detach($product->id);
            }

            // **Dispatch the OrderPlaced event for the current order**
            Event::dispatch(new OrderPlaced($order));
        }

        // Optionally, you can reload the cart to reflect the changes
        $cart->load('products');

        return redirect()->back()->with('success', 'Orders placed successfully and items removed from cart.');
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

    public function updateStatus(Request $request, $id)
    {
        // ... validation ...

        $order = Order::findOrFail($id);
        $order->status = $request->input('status');

        if ($request->input('status') === 'completed' && $request->has('shipping_id')) {
            $order->shipping_id = $request->input('shipping_id');
        }

        $order->save();

        return redirect()->back()->with('success', 'Order status updated successfully.');
    }
}
