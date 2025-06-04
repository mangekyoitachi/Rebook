<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

use App\Models\Review;
use App\Models\Shipping;
use App\Models\Shop;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function registerForm()
    {
        // return view('user.register');
        return Inertia::render('Auth/Register');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).+$/',
                'confirmed',
            ],
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ], [
            'password.regex' => 'Password must include letters, numbers, and special characters',
            'password.confirmed' => 'Passwords do not match',
        ]);

        Log::info('show request ---------->', $request->all());

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'image' => $request->file('image') ? $request->file('image')->store('images/users', 'public') : null,
            'password' => Hash::make($request->password),
            'role' => $request->input('role', 'user'), // Default role is 'user'
        ]);

        Auth::login($user);
        return redirect()
            ->route('user.dashboard')
            ->with('success', 'User registered successfully.');
    }

    public function loginForm()
    {
        // return view('user.login');
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            return redirect()->route('user.dashboard')->with('success', 'Logged in successfully.');
            // return redirect()
            //     ->route('user.dashboard')
            //     ->with('success', 'Logged in successfully.');
        }

        // Check if user with that email exists
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return back()->withErrors([
                'email' => 'Invalid email address.',
            ]);
        }

        // If user exists, check password
        if (!Hash::check($request->password, $user->password)) {
            return back()->withErrors([
                'password' => 'Incorrect password.',
            ]);
        }

        // Fallback (should not normally reach here)
        return back()->withErrors([
            'login' => 'Login failed. Please check your credentials.',
        ]);

        // return back()->withErrors(['error' => 'backend validation error']);
        // return redirect()->back()->with('error', 'Invalid credentials.');
    }

    public function dashboard(Request $request)
    {
        // Get authenticated user
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login');
        }


        $categories = Category::all();

        // Get all products with image URLs
        $products = Product::all();
        $products->transform(function ($product) {
            $product->image_url = $product->image
                ? asset('storage/' . $product->image)
                : null;
            return $product;
        });

        // Get top 10 products ordered by number of reviews (highest first), then by average review rating (highest first)
        $reviewedProducts = Review::selectRaw('product_id, AVG(rating) as avg_rating, COUNT(*) as review_count')
            ->groupBy('product_id')
            ->orderByDesc('review_count')
            ->orderByDesc('avg_rating')
            ->take(10)
            ->get()
            ->map(function ($item) {
                $product = Product::find($item->product_id);
                $latestReview = Review::where('product_id', $item->product_id)
                    ->orderByDesc('created_at')
                    ->first();

                if ($product) {
                    $product->image_url = $product->image
                        ? asset('storage/' . $product->image)
                        : asset('images/default.png');
                }

                return [
                    'product' => $product,
                    'latest_review' => $latestReview,
                    'avg_rating' => round($item->avg_rating, 2),
                    'review_count' => $item->review_count,
                ];
            });

        $showSalesPopup = Cache::get('show_sales_popup', false);

        return Inertia::render('Dashboard/Dashboard', [
            'user' => $user,
            'categories' => $categories,
            'products' => $products,
            'reviewedProducts' => $reviewedProducts,
            'productsRating' => $products
                ->mapWithKeys(function ($product) {
                    $averageRating = Review::where('product_id', $product->id)
                        ->avg('rating');
                    $roundedRating = round($averageRating * 2) / 2;
                    return [$product->id => $roundedRating];
                }),
            'showSalesPopup' => $showSalesPopup
        ]);
    }

    public function becomeSellerView()
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login');
        }

        // Get all products belonging to the current seller
        $products = Product::where('seller_id', $user->id)->get();

        // Transform products to include image URLs
        $products->transform(function ($product) {
            $product->image_url = $product->image
                ? asset('storage/' . $product->image)
                : null;
            return $product;
        });

        // Extract the IDs of the seller's products
        $productIds = $products->pluck('id');

        // Retrieve OrderItems that contain the seller's products
        $orderItems = OrderItem::whereIn('product_id', $productIds)
            ->with(['order', 'product'])
            ->get();

        // Transform orderItems to add image_url to each product
        $orderItems->transform(function ($orderItem) {
            if ($orderItem->product) {
                $orderItem->product->image_url = $orderItem->product->image
                    ? asset('storage/' . $orderItem->product->image)
                    : null;
            }
            return $orderItem;
        });

        // Extract the unique orders from the OrderItems
        $orders = $orderItems->pluck('order')->unique('id')->values();

        $shop = $user->shop; // assumes a User hasOne Shop relationship
        $categories = Category::all(); // if relevant to seller
        $seller_id = $user->id;

        $shippings = Shipping::all();
        $allUsers = User::all();

        // calculate overall rating for the seller
        $overallRating = Review::where('user_id', $seller_id)
            ->avg('rating');
        $overallRating = round($overallRating * 2) / 2;

        return Inertia::render('Seller/Seller', [
            'user' => $user,
            'seller_id' => $seller_id,
            'shop' => $shop,
            'categories' => $categories,
            'orderItems' => $orderItems,
            'products' => $products,
            'orders' => $orders,
            'shippings' => $shippings,
            'allUsers' => $allUsers,
            'overallRating' => $overallRating,
        ]);
    }

    public function becomeSeller(Request $request)
    {
        $user = Auth::user();

        User::where('id', $user->id)->update(['role' => 'seller']);

        // return redirect()->route('shop.create')->with('success', 'You are now a seller.');

        return back();
    }
    public function logout()
    {
        Auth::logout();
        return redirect()->route('login')->with('success', 'Logged out successfully.');
    }

    // --- React Test ---
    public function test()
    {
        $carts = Cart::all();
        $cartItems = CartItem::all();
        $categories = Category::all();
        $orders = Order::all();
        $orderItems = OrderItem::all();
        $payments = Payment::all();
        $products = Product::all();
        $reviews = Review::all();
        $shippings = Shipping::all();
        $shops = Shop::all();
        $users = User::all();

        return Inertia::render('ReactTest/ReactTest', [
            'carts' => $carts,
            'categories' => $categories,
            'cartItems' => $cartItems,
            'orders' => $orders,
            'orderItems' => $orderItems,
            'payments' => $payments,
            'products' => $products,
            'reviews' => $reviews,
            'shippings' => $shippings,
            'shops' => $shops,
            'users' => $users,
        ]);
    }
}
