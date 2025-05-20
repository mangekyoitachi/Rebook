<?php

use Illuminate\Support\Facades\Route;


// BACKEND
use App\Http\Controllers\CartController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShippingController;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Notification;


// Route::get('/', function () {
//     return view('welcome');
// });

Route::middleware(['guest'])->group(function () {
    //login and register
    Route::get('/register', [UserController::class, 'registerForm'])->name('user.register');
    Route::post('/register', [UserController::class, 'register'])->name('user.register.post');

    Route::get('/login', [UserController::class, 'loginForm'])->name('login');
    Route::post('/login', [UserController::class, 'login'])->name('user.login.post');
});

Route::middleware(['auth'])->group(function () {
    //dashboard for users
    Route::get('/dashboard', [UserController::class, 'dashboard'])->name('user.dashboard');
    Route::post('/logout', [UserController::class, 'logout'])->name('user.logout');

    //option for becoming a seller
    Route::get('/become-a-seller', [UserController::class, 'becomeSellerView'])->name('user.become_seller');
    Route::put('/become-a-seller', [UserController::class, 'becomeSeller'])->name('user.become_seller.post');

    //category to show products
    Route::get('/categories/{id}', [CategoryController::class, 'categoryShow'])->name('category.show');

    //product show and review
    Route::get('/product/{id}', [ReviewController::class, 'viewOneProduct'])->name('product.show');

    //product review
    Route::post('/product/{id}/review', [ReviewController::class, 'storeReview'])->name('product.review.store');
    Route::post('/product/{id}/review/edit', [ReviewController::class, 'editReview'])->name('product.review.edit');

    //cart management
    Route::post('/product/{id}/add-to-cart', [CartController::class, 'addToCart'])->name('product.add.to.cart');
    Route::get('/cart/{id}', [CartController::class, 'viewCart'])->name('cart.view');
    Route::put('/cart/{product}/update', [CartController::class, 'updateCart'])->name('cart.update');
    Route::delete('/cart/{id}/remove', [CartController::class, 'removeFromCart'])->name('cart.remove');
    Route::delete('/cart/clear', [CartController::class, 'clearCart'])->name('cart.clear');

    //order management
    Route::post('/order/store', [OrderController::class, 'storeOrder'])->name('order.store');
    Route::get('/order/{id}', [OrderController::class, 'showOrder'])->name('order.show');
    Route::delete('/order/{id}/cancel', [OrderController::class, 'cancelOrder'])->name('order.cancel');
    Route::post('order/{id}/shipping', [OrderController::class, 'storeShipping'])->name('order.shipping.store');

    //payment
    Route::post('/orders/{id}/pay', [PaymentController::class, 'storePayment'])->name('payment.store');
    Route::post('/orders/{id}/cancelled', [PaymentController::class, 'storeCancelledPayment'])->name('payment.cancelled');

    //shipping address
    Route::get('/shipping/create', [ShippingController::class, 'shippingForm'])->name('shipping.form');
    Route::post('/shipping/post', [ShippingController::class, 'storeShipping'])->name('shipping.store');

    //user profile
    Route::get('/profile', [ProfileController::class, 'showProfile'])->name('user.profile');
    Route::put('/profile/update', [ProfileController::class, 'updateProfile'])->name('user.profile.update');
});

Route::middleware(['auth', 'seller'])->group(function () {
    //initial stage on creating a shop
    Route::get('/create-shop', [ShopController::class, 'shopCreate'])->name('shop.create');
    Route::post('/create-shop', [ShopController::class, 'shopStore'])->name('shop.store');

    //shop overview of the seller
    Route::get('/shop/dashboard/', [ShopController::class, 'shopDashboard'])->name('shop.dashboard');

    //product management
    Route::get('/shop/create-product', [ProductController::class, 'productCreate'])->name('product.create');
    Route::post('/shop/create-product', [ProductController::class, 'productStore'])->name('product.store');
    Route::get('/shop/{id}/edit-product', [ProductController::class, 'productEdit'])->name('seller.product.edit');
    Route::put('/shop/{id}/edit-product', [ProductController::class, 'productUpdate'])->name('seller.product.update');
    Route::delete('/shop/{id}/delete-product', [ProductController::class, 'productDelete'])->name('seller.product.delete');
    Route::get('/shop/{id}/product', [ProductController::class, 'productShow'])->name('seller.product.show');

    //business analytics
    Route::get('/shop/business-analytics', [ShopController::class, 'businessAnalytics'])->name('shop.analytics');
});

    //Task Scheduling
    Route::get('/check-sales-reminder', function () {
        return response()->json(['show' => Cache::get('show_sales_popup', false)]);
    });

    //Notification
  
    Route::get('/notifications', [App\Http\Controllers\NotificationController::class, 'index'])->middleware('auth')->name('notifications.index');
