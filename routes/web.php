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
use App\Models\Shipping;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\GoogleController;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Notification;
use inertia\Inertia;

// redirect to Google OAuth
Route::get('/auth/google', [GoogleController::class, 'redirectToGoogle'])->name('google.login');
Route::get('/auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);

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
    Route::delete('/product/{id}/review/delete', [ReviewController::class, 'deleteReview'])->name('product.review.delete');


    // Route::put('/product/{id}/review/edit', [ReviewController::class, 'editReview'])->name('product.review.edit');
    // Route::delete('/product/{id}/review/delete', [ReviewController::class, 'deleteReview'])->name('product.review.destroy');

    //cart management
    Route::get('/cart/{id}', [CartController::class, 'viewCart'])->name('cart.view');
    Route::post('/product/{id}/add-to-cart', [CartController::class, 'addToCart'])->name('product.add.to.cart');

    Route::put('/cart/{product}/update', [CartController::class, 'updateCart'])->name('cart.update');
    Route::delete('/cart/{id}/remove', [CartController::class, 'removeFromCart'])->name('cart.remove');
    Route::delete('/cart/clear', [CartController::class, 'clearCart'])->name('cart.clear');

    //order management
    Route::post('/order/store', [OrderController::class, 'storeOrder'])->name('order.store');
    Route::get('/order/{id}', [OrderController::class, 'showOrder'])->name('order.show');
    Route::delete('/order/{id}/cancel', [OrderController::class, 'cancelOrder'])->name('order.cancel');
    Route::post('order/{id}/shipping', [OrderController::class, 'storeShipping'])->name('order.shipping.store');

    Route::put('/order/{id}/status', [OrderController::class, 'updateStatus']);
    //payment
    Route::post('/orders/{id}/pay', [PaymentController::class, 'storePayment'])->name('payment.store');
    Route::post('/orders/{id}/cancelled', [PaymentController::class, 'storeCancelledPayment'])->name('payment.cancelled');

    //shipping address
    Route::get('/shipping/create', [ShippingController::class, 'shippingForm'])->name('shipping.form');
    Route::post('/shipping/post', [ShippingController::class, 'storeShipping'])->name('shipping.store');
    Route::put('/shipping/{id}/update',[ShippingController::class, 'updateShipping']);
    Route::delete('shipping/{id}', [ShippingController::class, 'deleteShipping']);


    //user profile
    Route::get('/profile', [ProfileController::class, 'showProfile'])->name('user.profile');
    Route::put('/profile/update', [ProfileController::class, 'updateProfile'])->name('user.profile.update');

});

Route::middleware(['auth', 'seller'])->group(function () {
    //initial stage on creating a shop
    Route::get('/create-shop', [ShopController::class, 'shopCreate'])->name('shop.create');
    Route::post( '/create-shop', [ShopController::class, 'shopStore'])->name('shop.store');

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

Route::middleware(['auth', 'is_admin'])->group(function () {
    //admin dashboard
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');

    //user management
    Route::get('/admin/users', [UserController::class, 'userManagement'])->name('admin.users');
    Route::put('/admin/users/{id}/update', [UserController::class, 'updateUser'])->name('admin.user.update');
    Route::delete('/admin/users/{id}/delete', [UserController::class, 'deleteUser'])->name('admin.user.delete');

    //product management
    Route::get('/admin/products', [ProductController::class, 'productManagement'])->name('admin.products');
    Route::put('/admin/products/{id}/update', [ProductController::class, 'updateProduct'])->name('admin.product.update');
    Route::delete('/admin/products/{id}/delete', [ProductController::class, 'deleteProduct'])->name('admin.product.delete');

    //category management
    Route::get('/admin/categories', [CategoryController::class, 'categoryManagement'])->name('admin.categories');
    Route::post('/admin/categories/create', [CategoryController::class, 'createCategory'])->name('admin.category.create');
    Route::put('/admin/categories/{id}/update', [CategoryController::class, 'updateCategory'])->name('admin.category.update');
    Route::delete('/admin/categories/{id}/delete', [CategoryController::class, 'deleteCategory'])->name('admin.category.delete');
});

    //Task Scheduling
    Route::get('/check-sales-reminder', function () {
        return response()->json(['show' => Cache::get('show_sales_popup', false)]);
    });

    //Notification
    Route::get('/notifications', [App\Http\Controllers\NotificationController::class, 'index'])->middleware('auth')->name('notifications.index');
    //Notification
    Route::get('/notifications', [App\Http\Controllers\NotificationController::class, 'index'])->middleware('auth')->name('notifications.index');

    Route::get('/images/{path}', [ReviewController::class, 'image']);
    Route::get('/test', function () {
        return response('Laravel is working!')->header('Content-Type', 'text/plain');
    });

     // react
    Route::get('/', [UserController::class, 'test']);
    Route::get('/cart-react', function() {
        return inertia::render('Cart/Cart');
    });

