import React, { useState } from "react"
import { useForm, router } from "@inertiajs/react"

function Product({ product, reviews }) {
    const form = useForm({
        quantity: 1,
    })

    console.log('initial quantity: ', form.data.quantity)

    const decreaseQuantity = () => {
        if (form.data.quantity > 1) {
            form.setData('quantity', form.data.quantity - 1)
        }
    }

    const increaseQuantity = () => {
        if (form.data.quantity < product?.stock) {
            form.setData('quantity', form.data.quantity + 1)
        }
    }

    const handleAddToCart = (e) => {
        e.preventDefault()

        console.log('current quantity to pass ---> ', form.data.quantity)

        // Basic client-side validation
        if (form.data.quantity <= 0) {
            form.setError('quantity', 'Quantity must be at least 1')
            return
        }

        if (form.data.quantity > product?.stock) {
            form.setError('quantity', 'Not enough stock available')
            return
        }

        console.log('check quantity: ', form.data.quantity)

        // Submit the form using Inertia
        form.post(`/product/${product.id}/add-to-cart`, {
            preserveScroll: true,
        })
    }

    return (
        <>
            <div className="rounded-xl bg-white shadow-md w-full h-150 flex flex-row">
                <div className="w-[40%] border-r border-gray-400">
                    <div className="rounded-xl flex justify-center items-start bg-gray-100 overflow-hidden m-8">
                        {product.image_url ? (
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-125 object-cover"
                            />
                        ) : (
                            <div className="w-full h-125 flex items-center justify-center text-gray-500 text-xl bg-gray-200">
                                No image preview
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col justify-between w-[60%] m-8">
                    <h1 className="text-xl md:text-3xl font-semibold text-gray-800">{product?.name}</h1>

                    {form.errors.quantity && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                            {form.errors.quantity}
                        </div>
                    )}

                    {form.recentlySuccessful && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
                            Product added to cart successfully.
                        </div>
                    )}

                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-red-600">₱{product?.price}</span>
                    </div>

                    <div className="space-y-4 border-t border-b py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="text-sm">Descriptions</div>
                            </div>
                            <span className="text-gray-500 text-sm">{product?.description}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="text-sm">Stock</div>
                            </div>
                            <span className="text-gray-500 text-sm">{product?.stock}</span>
                        </div>
                    </div>

                    <div>
                        <span className="text-gray-600">Quantity:</span>
                        <div className="flex items-center mt-2">
                            <button
                                type="button"
                                onClick={decreaseQuantity}
                                className="border border-gray-300 rounded-l p-2 hover:bg-gray-100"
                                disabled={form.processing}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                name="quantity"
                                min="1"
                                max={product?.stock}
                                value={form.data.quantity}
                                onChange={(e) => form.setData('quantity', parseInt(e.target.value) || 1)}
                                className="border-t border-b border-gray-300 py-2 w-12 text-center"
                                disabled={form.processing}
                            />
                            <button
                                type="button"
                                onClick={increaseQuantity}
                                className="border border-gray-300 rounded-r p-2 hover:bg-gray-100"
                                disabled={form.processing}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            className="flex-1 border border-red-500 text-pink-red py-3 rounded-lg font-medium hover:bg-red-50 transition"
                        >
                            Buy Now
                        </button>
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={form.processing}
                            className="flex-1 bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-75"
                        >
                            {form.processing ? 'Adding...' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Product
