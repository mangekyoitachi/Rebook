import React from "react";
import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";

// reviewedProducts should be an array of objects like:

export default function Navigation({ reviewedProducts = [] }) {
    const [products, setProducts] = useState(reviewedProducts);

    useEffect(() => {
        if (products.length !== reviewedProducts.length) {
            setProducts(reviewedProducts);
        }
    }, [reviewedProducts]);

    return (
        <>
            {/* --- NAVIGATION --- */}
            <div className="flex flex-row justify-center flex-wrap gap-x-[3%] text-red-800 font-medium text-[18px] shadow-md pb-4">
                {/* --- Sale Items Link --- */}
                <div className="hover:bg-red-800 hover:text-white hover:rounded-2xl hover:px-2 px-2">
                    <Link
                        href={"/dashboard"}
                        className="inline"
                    >
                        Sale Items
                    </Link>
                </div>

                {/* --- Dynamically Rendered Product Links --- */}
                {reviewedProducts.map(product => (
                    <div
                        key={product.product.id}
                        className="hover:bg-red-800 hover:text-white hover:rounded-2xl hover:px-2 px-2"
                    >
                        <Link
                            href={`/product/${product.product.id}`}
                            preserveScroll
                            preserveState
                            method="get"
                            as="button"
                            className="inline"
                        >
                            {product.product.name}
                        </Link>
                    </div>
                ))}
            </div>
        </>
    );
}
