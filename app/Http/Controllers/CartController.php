<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\User;
use App\Models\Product;
use App\Models\Shipping;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use inertia\Inertia;
use Illuminate\Support\Facades\Log;

use Illuminate\Support\Facades\Session;

class CartController extends Controller
{

    public function viewCart($id)
    {
        $user = Auth::user();

        // if (!$user || $user->id != $id) {
        //     // Optionally handle unauthorized access
        //     abort(403, 'Unauthorized access to cart.');
        // }

        $cart = Cart::where('user_id', $user->id)->first();

        // Task to retrieve authenticated user's shipping address
        $shippingAddresses = Shipping::where('user_id', $user->id)->get();

        // Task to retrieve the authenticated user's orders (optional)
        $orders = Order::where('user_id', $user->id)->get();


        // If cart doesn't exist, optionally create one
        if (!$cart) {
            $cart = Cart::create(['user_id' => $user->id]);
        }

        $cartItems = $cart->products()->withPivot('quantity')->get();

        // retrive users cart product image
        $products = Product::all();
        $products->transform(function ($product) {
            $product->image_url = $product->image
                ? asset('storage/' . $product->image)
                : null; // Default image if no image is set
            return $product;
        });

        $orderPlacedNotification = Session::get('order_placed_notification');
        $orderPlacedMessage = Session::get('order_placed_message');

        return Inertia::render('Cart/Cart', [
            'user' => $user,
            'cart' => $cart,
            'cartItems' => $cartItems,
            'shippingAddresses' => $shippingAddresses,
            'orders' => $orders,
            'products' => $products,
            'orderPlacedNotification' => $orderPlacedNotification,
            'orderPlacedMessage' => $orderPlacedMessage,
        ]);
    }

    public function addToCart(Request $request, $id)
    {
        // $user = Auth::user();
        // $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        // $product = Product::findOrFail($id);
        // $requestQuantity = (int)$request->input('quantity');


        // $existingItem = $cart->products()->where('product_id', $id)->first();

        // $existingQuantity = $existingItem ? $existingItem->pivot->quantity : 0;
        // $quantity = $existingQuantity + $requestQuantity;

        // if ($quantity > $product->stock) {
        //     return redirect()->back()->with('error', 'Not enough stock available.');
        // }

        // if ($quantity <= 0) {
        //     return redirect()->back()->with('error', 'Quantity must be atleast 1.');
        // }

        // if($existingItem) {
        //     $cart->products()->updateExistingPivot($id, [
        //         'quantity' => $existingItem->pivot->quantity + $quantity
        //     ]);
        // } else {
        //     $cart->products()->attach($id, [
        //         'quantity' => $quantity
        //     ]);
        // }

        // return redirect()->route('product.show', $id)->with('success', 'Product added to cart successfully.');


        // react
        $user = Auth::user();
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        $product = Product::findOrFail($id);
        $requestQuantity = (int)$request->input('quantity');

        $existingItem = $cart->products()->where('product_id', $id)->first();

        if ($existingItem) {
            // Calculate the new total quantity
            $newTotalQuantity = $existingItem->pivot->quantity + $requestQuantity;

            // Check if enough stock is available
            if ($newTotalQuantity > $product->stock) {
                return redirect()->back()->with('error', 'Not enough stock available.');
            }

            if ($newTotalQuantity <= 0) {
                // If the new quantity would be 0 or negative, remove the product from cart
                $cart->products()->detach($id);
                return redirect()->back()->with('success', 'Product removed from cart.');
            }

            // Update the existing pivot record with the new total quantity
            $cart->products()->updateExistingPivot($id, [
                'quantity' => $newTotalQuantity
            ]);
        } else {
            // This is a new product being added to cart

            // Check if the requested quantity is valid
            if ($requestQuantity > $product->stock) {
                return redirect()->back()->with('error', 'Not enough stock available.');
            }

            if ($requestQuantity <= 0) {
                return redirect()->back()->with('error', 'Quantity must be at least 1.');
            }

            // Add the product to cart with the requested quantity
            $cart->products()->attach($id, [
                'quantity' => $requestQuantity
            ]);
        }

        return redirect()->back()->with('success', 'Cart updated successfully.');
    }

    public function updateCart(Request $request, Product $product)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $user = Auth::user();
        $cart = $user->cart;

        //same error handling as in addToCart where the stock shouldn't exceed the available stock
        if ($request->input('quantity') > $product->stock)  {
            return redirect()->back()->with('error', 'Not enough stock available.');
        }

        if ($request->input('quantity') <= 0) {
            return redirect()->back()->with('error', 'Quantity must be atleast 1.');
        }
        //check if the product is in the cart

        if (!$cart || !$cart->products->contains($product->id)) {
            return redirect()->back()->with('error', 'Product not found in cart.');
        }

        $cart->products()->updateExistingPivot($product->id, [
            'quantity' => $request->input('quantity'),
        ]);

        return redirect()->back()->with('success', 'Cart updated successfully.');

    }

    public function removeFromCart($id)
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->first();

        if($cart) {
            $cart->products()->detach($id);
            return redirect()->back()->with('success', 'Product removed from cart successfully.');
        }

        return redirect()->back()->with('error', 'Cart not found.');
    }


    public function clearCart(Request $request)
    {
        $user = Auth::user();
        $productIds = $request->input('ids', []);
        Log::info('Attempting detach', ['user_id' => $user->id, 'product_ids' => $productIds]);

        $cart = Cart::where('user_id', $user->id)->first();

        if ($cart && !empty($productIds)) {
            try {
                $cart->products()->detach($productIds);
                Log::info('Detach successful');
                return back()->with('success', 'Selected items removed successfully.');
            } catch (\Exception $e) {
                Log::error('Error during detach', ['error' => $e->getMessage()]);
                return back()->with('error', 'Failed to remove items.');
            }
        }

        return back()->with('error', 'Cart not found or no items selected.');
    }
}
