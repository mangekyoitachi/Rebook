<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use App\Models\Product;
use App\Models\Category;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use inertia\Inertia;

class ShopController extends Controller
{
    public function shopCreate()
    {
        return view('seller.shop_create');
    }

    public function shopStore(Request $request)
    {
        // $request->validate([
        //     'shop_name' => 'required|string|max:255|unique:shops',
        //     'description' => 'nullable|string|max:1000',
        // ]);

        // Shop::create([
        //     'seller_id' => Auth::id(),
        //     'shop_name' => $request->shop_name,
        //     'description' => $request->description,
        // ]);

        // return redirect()->route('shop.dashboard')->with('success', 'Shop created successfully.');


        // react


        // if (!Auth::check()) {
        //     abort(403, 'Unauthorized action.');
        // }

        $user = Auth::user();
        User::where('id', $user->id)->update(['role' => 'seller']);


        $request->validate([
            'shop_name' => 'required|string|max:255|unique:shops',
            'description' => 'nullable|string|max:1000',
        ]);

        Shop::create([
            'seller_id' => Auth::id(),  // must not be null
            'shop_name' => $request->shop_name,
            'description' => $request->description,
        ]);

        return back();
    }

    public function shopDashboard()
    {
        $sellerId = Auth::id();
        $shop = Shop::where('seller_id', $sellerId)->first();
        $categories = Category::all();

        $orderItems = OrderItem::with(['product', 'order.users', 'order.shipping', 'order.payment'])
            ->whereHas('product', function ($query) use ($sellerId) {
                $query->where('seller_id', $sellerId);
            })
            ->get();

        $products = Product::where('seller_id', $sellerId)->get();
        // return view('seller.shop_dashboard', compact('shop', 'products', 'categories', 'orderItems'));

        // react
        $user = Auth::user();
        return inertia::render('Seller/Seller', [
            'user' => $user,
            'seller_id' => $sellerId,
            'shop' => $shop,
            'categories' => $categories,
            'orderItems' => $orderItems,
            'products' => $products,
        ]);


    }

    public function businessAnalytics()
    {
        $sellerId = Auth::id();
        $shop = Shop::where('seller_id', $sellerId)->first();

        $orderItems = OrderItem::with([
            'product',
            'order.users',
            'order.shipping',
            'order.payment'
            ])
            ->whereHas('product', function ($query) use ($sellerId) {
                $query->where('seller_id', $sellerId);
            })->whereHas('order', function ($query) {
                $query->where('status', ['completed', 'cancelled']);
            })->whereHas('order.payment', function ($q) {
                $q->whereNotNull('transaction_id');
            })->get();

        //calculate total sales
        $totalEarnings = $orderItems->sum(function ($orderItem) {
            return $orderItem->price * $orderItem->quantity;
        });

        return view('seller.business_analytics', compact('shop', 'orderItems', 'totalEarnings'));
    }
}
