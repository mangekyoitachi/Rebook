<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ $user->name }}'s Cart</title>
</head>
<body>
    <a href="{{ route('user.dashboard') }}">Dashboard</a>
    <h1>{{ $user->name }}'s Cart</h1>
    <h2>Items in Cart</h2>



    @if (!$cart || $cart->products->isEmpty())
        <p>Your cart is empty.</p>
    @else
        <!-- Checkout form (selected items only) -->
        <form action="{{ route('order.store') }}" method="POST">
            @csrf

            @foreach ($cart->products as $product)
                <div style="margin-bottom: 30px; border-bottom: 1px solid #ccc; padding-bottom: 15px;">
                    <h3>{{ $product->name }}</h3>
                    <p>Price: ₱{{ $product->price }}</p>
                    <p>Total: ₱{{ $product->price * $product->pivot->quantity }}</p>
                    <img src="{{ asset('storage/' . $product->image) }}" width="150" alt="Product Image">

                    <!-- Select for checkout -->
                    <label>
                        <input type="checkbox" name="selected_items[]" value="{{ $product->id }}">
                        Select for Checkout
                    </label>
                </div>
            @endforeach

            <button type="submit" style="margin-top: 20px;">Proceed to Checkout</button>
        </form>

        <hr>

        <!-- Update quantity & remove item (independent forms) -->
        <h2>Manage Cart</h2>
        @foreach ($cart->products as $product)
            <!-- Update quantity form -->

            {{-- error if quantity exceeds the stocks--}}
            @if (session('error'))
                <div style="color: red; margin-bottom: 10px;">
                    {{ session('error') }}
                </div>
            @endif
            <form action="{{ route('cart.update', $product->id) }}" method="POST" style="margin-bottom: 10px;">
                @csrf
                @method('PUT')
                <label>Update Quantity for {{ $product->name }}: </label>

                <input type="number" name="quantity" value="{{ $product->pivot->quantity }}" min="1" required>

                <button type="submit">Update</button>
            </form>

            <!-- Remove from cart form -->
            <form action="{{ route('cart.remove', $product->id) }}" method="POST" style="margin-bottom: 20px;">
                @csrf
                @method('DELETE')
                <button type="submit">Remove {{ $product->name }}</button>
            </form>
        @endforeach

        <!-- Clear entire cart -->
        <form action="{{ route('cart.clear') }}" method="POST" style="margin-top: 30px;">
            @csrf
            @method('DELETE')
            <button type="submit" style="color: red;">Clear Entire Cart</button>
        </form>
    @endif



</body>
</html>
