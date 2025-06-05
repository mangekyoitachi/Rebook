import React from "react"
import CartItem from "./CartItem"

function CartItemList({
    cartItems,
    toggleSelectItem,
    increaseQuantity,
    decreaseQuantity,
    deleteItem,
    handleQuantityChange,
    products,
}) {
    return (
        <div className="m-4 bg-white shadow-md rounded-xl space-y-4">
            {cartItems.map((item) => (
                <CartItem
                    key={item.id}
                    item={item}
                    toggleSelectItem={toggleSelectItem}
                    increaseQuantity={increaseQuantity}
                    decreaseQuantity={decreaseQuantity}
                    deleteItem={deleteItem}
                    handleQuantityChange={handleQuantityChange}
                    products={products}
                />
            ))}
        </div>
    );
}

export default CartItemList;
