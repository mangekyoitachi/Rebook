import React, { useState } from "react"
import { Link } from "@inertiajs/react"
import pen from "../../../../public/Assets/Dashboard/Product/pen.jpg"
import iconCart from "../../../../public/Assets/Dashboard/Product/iconCart.png"
import iconStar1 from "../../../../public/Assets/Dashboard/Product/iconStar1.png"

function Product({ title, products, productsRating }) {
    return (
        <>
            <h2 className="shadow-md border-b mt-20 text-3xl font-bold text-[#5a1c1c] border-gray-300 py-4 uppercase text-center mb-8">
                {title}
            </h2>

            <div className="flex flex-wrap flex-row mb-20 justify-center w-full gap-10 px-[5%]">
                {products?.map((product) => (
                    <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        method="get"
                        className="rounded-xl shadow-md flex flex-col bg-white"
                    >
                        <div>
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="rounded-xl shadow-md w-80 h-80 m-4 object-cover"
                                />
                            ) : (
                                <div className="w-80 h-80 m-4 flex items-center justify-center rounded-xl shadow-md bg-gray-100 text-gray-500">
                                    No image preview
                                </div>
                            )}

                            <p className="text-center text-2xl font-bold text-[#5a1c1c] p-4">{product.name}</p>
                        </div>

                        <div className="p-4">
                            <div className="flex flex-row justify-end mb-4">
                                {/* --- STAR --- */}
                                <img
                                    src={iconStar1}
                                    alt="star"
                                    className="w-6"
                                />

                                {/* --- NUMBER --- */}
                                <span>
                                    {/* logic rating */}
                                    {parseFloat((productsRating?.[product.id] || 0).toFixed(2))
                                        ? parseFloat((productsRating?.[product.id] || 0).toFixed(2))
                                        : "No rating yet"}
                                </span>
                            </div>

                            {/* --- ICON & PRICE ---*/}
                            <div className="flex flex-row justify-between items-center">
                                {/* --- ICON --- */}
                                <img
                                    src={iconCart}
                                    alt="cart"
                                    className="w-8"
                                />

                                {/* --- PRICE --- */}
                                <p className="text-xl font-bold">
                                    {/* logic pricing */}
                                    ₱{product.price}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    )
}

export default Product
