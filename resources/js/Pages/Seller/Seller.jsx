import React, { useState } from "react"
import Header from "../../Components/SellerComponents/Header"
import Body from "../../Components/SellerComponents/Body"
import { usePage } from "@inertiajs/react"

export default function Seller() {
    const [currentComponent, setCurrentComponent] = useState("dashboard")
    const {
        user,
        seller_id,
        shop,
        categories,
        orders,
        orderItems,
        products,
        shippings,
        allUsers,
        overallRating,
    } = usePage().props

    const handleComponentChange = (component) => {
        setCurrentComponent(component)
    }

    return (
        <>
            <Header
                currentComponent={currentComponent}
                onChangeComponent={handleComponentChange}
                user={user}
            />
            <Body
                component={currentComponent}
                onChangeComponent={handleComponentChange}
                user={user}
                seller_id={seller_id}
                shop={shop}
                categories={categories}
                orders={orders}
                orderItems={orderItems}
                products={products}
                shippings={shippings}
                allUsers={allUsers}
                overallRating={overallRating}
            />
        </>
    )
}
