<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <a href="{{route('user.dashboard')}}">Dashboard</a>
   <h1>{{$product->name}}</h1>
    <h2>Product Details</h2>
    <p>Price: ₱{{$product->price}}</p>
    <p>Description: {{$product->description}}</p>
    <p>Seller: {{$product->user->name}}</p>
    <img src="{{asset('storage/' . $product->image)}}" alt="Product Image" width="150">

    @if(session('error'))
        <div class="alert alert-danger">
            {{ session('error') }}
        </div>
    @else
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
    @endif
    {{-- add to cart --}}
    <form action="{{route('product.add.to.cart', $product->id)}}" method="POST">
        @csrf
        <label for="quantity">Quantity:</label>
        <input type="number" id="quantity" name="quantity" min="1" max="{{$product->stock}}" required>
        <button type="submit">Add to Cart</button>
    </form>

    <h2>Reviews</h2>
    @if($reviews->isEmpty())
        <p>No reviews available for this product.</p>
    @else
        <ul>
            @foreach ($reviews as $review)
                <li>
                    <strong>{{ $review->user->name }}:</strong>(Rating: {{ $review->rating }}) {{ $review->created_at->format('Y-m-d') }}
                    <p>{{ $review->comment }}</p>

                    @if(Auth::check() && Auth::id() === $review->user_id)
                        <button onlick="toggleEdit({{$review->id}})">Edit</button>

                        <form action="{{route('product.review.edit', $review->id)}}" id="edit-form-{{$review->id}}" method="POST" style="display:none;">
                            @csrf
                            @method('PUT')
                            <label for="comment">Edit Comment:</label>
                            <textarea name="comment" id="comment" cols="30" rows="10" required>{{$review->comment}}</textarea>

                            <label for="rating">Edit Rating:</label>
                            <select name="rating" id="rating" required>
                                @for ($i = 1; $i <= 5; $i++)
                                    <option value="{{ $i }}" {{ $review->rating == $i ? 'selected' : '' }}>{{ $i }}</option>
                                @endfor
                            </select>
                            <button type="submit">Update Review</button>
                        </form>

                        <form action="{{route('product.review.destroy', $review->id)}}" method="POST">
                            @csrf
                            @method('DELETE')
                            <button type="submit" onclick="return confirm('Are you sure you want to delete this review?')">Delete</button>
                        </form>
                    @endif
                </li>
            @endforeach
        </ul>
    @endif
    <h2>Leave a Review</h2>
    <form action="{{ route('product.review.store', $product->id) }}" method="POST">
        @csrf
        <label for="comment">Comment:</label>
        <textarea name="comment" id="comment" required></textarea>

        <label for="rating">Rating:</label>
        <select name="rating" id="rating" required>
            @for ($i = 1; $i <= 5; $i++)
                <option value="{{ $i }}">{{ $i }}</option>
            @endfor
        </select>

        <button type="submit">Submit Review</button>
</body>
<script>
    function toggleEdit(id)
    {
        const form = document.getElementById('edit-form-' + id);
        const comment = document.getElementById('comment-' + id);

        if (form.style.display === 'none') {
            form.style.display = 'block';
            comment.style.display = 'none';
        } else {
            form.style.display = 'none';
            comment.style.display = 'block';
        }
    }
</script>
</html>
