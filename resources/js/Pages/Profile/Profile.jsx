import React from "react"

import Header from "../../Components/DashboardComponents/Header"
import Navigation from "../../Components/DashboardComponents/Navigation"
import Body from "../../Components/ProfileComponents/Body"
import { usePage } from "@inertiajs/react"

export default function Profile() {
    // Extracting props from the page using usePage hook
    // This allows us to access the data passed from the server
    const { user, orders, orderItems, products } = usePage().props

    return (
        <>
            <Header />
            <Navigation />

            <Body
                user={user}
                orders={orders}
                orderItems={orderItems}
                products={products}
            />
        </>
    )
}
