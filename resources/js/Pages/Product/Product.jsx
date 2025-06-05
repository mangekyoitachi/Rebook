import React from "react";
import Header from "../../Components/DashboardComponents/Header";
import Navigation from "../../Components/DashboardComponents/Navigation";
import Body from "../../Components/ProductComponents/Body";

import { usePage } from "@inertiajs/react";
 function Product({}){
    const { product, reviews, user } = usePage().props

    console.log("check data comming product stock: ", product.stock)

    return(
        <>
            <Header />
            <Navigation />

            <Body product={product} reviews={reviews} user={user}/>
        </>
    )
}
export default Product
