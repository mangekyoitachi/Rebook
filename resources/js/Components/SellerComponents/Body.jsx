import React, { useState } from "react";
import Dashboard from "./Body/Dashboard";
import Register from "./Body/Register";
import Product from "./Body/Product";
import Order from "./Body/Order";

function Body({
    component,
    onChangeComponent,
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
}) {
    const renderComponent = () => {
        if (user?.role !== "seller" || shop == null) return <Register user={user} />;

        switch (component?.toLowerCase()) {
            case "order":
                return <Order orders={orders} orderItems={orderItems} allUsers={allUsers}/>;
            case "product":
                return <Product products={products} categories={categories} shippings={shippings} />;
            default:
                return <Dashboard setCurrentComponent={onChangeComponent} orders={orders} overallRating={overallRating}/>;
        }
    };

    return (
        <>
            {renderComponent()}
        </>
    );
}

export default Body;
