import React, { useState } from "react"
import Header from "../../Components/DashboardComponents/Header"
import Navigation from "../../Components/DashboardComponents/Navigation"
import Body from "../../Components/CartComponents/Body"
import { usePage } from "@inertiajs/react"

export default function Cart() {
    const { user,
        cart,
        cartItems,
        shippingAddresses,
        orders ,
        products,
        orderPlacedNotification,
        orderPlacedMessage
    } = usePage().props
    return (
        <>
            <Header />
            <Navigation />

            <Body
                user={user}
                cart={cart}
                cart_Items={cartItems}
                shippingAddresses={shippingAddresses}
                orders={orders}
                products={products}
                orderPlacedNotification={orderPlacedNotification}
                orderPlacedMessage={orderPlacedMessage}
            />
        </>
    )
}
