import React from "react"

import Product from "./Body/Product"
import Rating from "./Body/Rating"

export default function Body({ product, reviews, user }) {
    return (
        <>
            <div className="mx-[10%] mt-20">
                <Product product={product} reviews={reviews} />
                <Rating product={product} reviews={reviews} user={user} />
            </div>
        </>
    )
}
