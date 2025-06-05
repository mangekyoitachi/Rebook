<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Policy;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Log;
use inertia\Inertia;

class ProductController extends Controller
{
    use AuthorizesRequests;
    /**
     * Show the form for creating a new product.
     *
     * @return \Illuminate\View\View
     */
    public function productCreate()
    {
        $this->authorize('create', Product::class);
        // Fetch categories for the product creation form
        $categories = Category::all();
        return view('seller.product.product_create', compact('categories'));
    }

    public function productStore(Request $request)
    {
        $this->authorize('create', Product::class);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'stock' => 'nullable|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Fetch the shop of the currently authenticated user
        $user = Auth::user();
        $shop = $user->shop;

        // Check if the shop exists for the user
        if (!$shop) {
            // If no shop is found, return with an error message
            return redirect()->route('shop.create')->withErrors([
                'shop' => 'You must create a shop before adding products.',
            ]);
        }

        // Create a new product and associate it with the found shop
        Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'category_id' => $request->category_id,
            'seller_id' => Auth::id(),
            'shop_id' => $shop->id,  // Add the shop_id here
            'stock' => $request->input('stock', 0), // Default to 0 if no stock is provided
            'image' => $request->file('image') ? $request->file('image')->store('images/products', 'public') : null,
        ]);

        // return redirect()->route('shop.dashboard')->with('success', 'Product created successfully.');
        return redirect()->back()->with('success', 'Product created successfully.');
    }

    public function productEdit($id)
    {
        $product = Product::findOrFail($id);
        $this->authorize('update', $product);
        $categories = Category::all();

        // return view('seller.product.product_edit', compact('product', 'categories'));
        return redirect()->back()
            ->with('success', 'Product edited successfully.')
            ->with('newProduct', $product);

    }

    public function productUpdate(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $this->authorize('update', $product);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'stock' => 'nullable|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $product->update([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'category_id' => $request->category_id,
            'stock' => $request->input('stock', 0), // Default to 0 if no stock is provided
            'image' => $request->file('image') ? $request->file('image')->store('images/products', 'public') : $product->image,
        ]);

        // return redirect()->route('shop.dashboard')->with('success', 'Product updated successfully.');
        return redirect()->back()
            ->with('success', 'Product updated successfully.')
            ->with('updatedProduct', $product);
    }


    public function productDelete($id)
    {
        $product = Product::findOrFail($id);

        $this->authorize('delete', $product);

        $product->delete();

        // return redirect()->route('shop.dashboard')->with('success', 'Product deleted successfully.');
        return redirect()->back()
            ->with('success', 'Product deleted successfully.')
            ->with('deleteProduct', $product);
    }

    public function productShow($id)
    {
        $product = Product::findOrFail($id);
        $category = Category::all();
        return view('seller.product.product_show', compact('product', 'category'));
    }

}
