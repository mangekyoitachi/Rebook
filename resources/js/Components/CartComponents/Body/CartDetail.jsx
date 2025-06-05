import React, { useState, useEffect, useRef } from "react"
import { useForm, router } from "@inertiajs/react"

import AddressBlock from "./AddressBlock"
import CartActions from "./CartAction"
import CartItemList from "./CartItemList"
import CartSummary from "./CartSummary"
import CheckoutButton from "./CheckoutButton"
import SendorderConfirmation from "./ShowEvents/SendorderConfirmation"

function CartDetail({ user, cart, cart_Items, shippingAddresses, orders, checkout, products, orderPlacedNotification, orderPlacedMessage }) {
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [isCheckingOut, setIsCheckingOut] = useState(false)
    const [cartItems, setCartItems] = useState([])
    const [allSelected, setAllSelected] = useState(false)
    const quantityTimers = useRef({}) // Use useRef for timers

    const updateForm = useForm({
        id: null,
        quantity: 0
    })

    const deleteForm = useForm({})
    const clearForm = useForm({})
    const checkoutForm = useForm({
        selected_items: [],
        shipping_address_id: null
    })

    useEffect(() => {
        if (cartItems.length === 0 && cart_Items?.length > 0) {
            const formattedItems = cart_Items.map(item => ({
                ...item,
                quantity: item.pivot.quantity,
                selected: false
            }))
            setCartItems(formattedItems)
        }
    }, [cart_Items])

    const handleAddressSelected = (addressId) => {
        setSelectedAddress(shippingAddresses.find(addr => addr.id === addressId))
        checkoutForm.setData('shipping_address_id', addressId)
        console.log('Selected address ID in CartDetail:', addressId)
    }

    const toggleSelectAll = () => {
        const newState = !allSelected
        setCartItems(prevItems =>
            prevItems.map(item => ({ ...item, selected: newState }))
        )
        setAllSelected(newState)
    }

    const toggleSelectItem = (id) => {
        setCartItems(prevItems => {
            const updated = prevItems.map(item =>
                item.id === id ? { ...item, selected: !item.selected } : item
            )
            setAllSelected(updated.every(item => item.selected))
            return updated
        })
    }

    const increaseQuantity = (id) => {
        const item = cartItems.find(i => i.id === id)
        if (!item || !item.pivot || typeof item.pivot.quantity !== 'number') return
        const currentQty = item.pivot.quantity
        if (currentQty >= item.stock) {
            alert(`Sorry, only ${item.stock} units available.`)
            return
        }
        const newQty = currentQty + 1
        setCartItems(prev =>
            prev.map(i =>
                i.id === id
                    ? { ...i, pivot: { ...i.pivot, quantity: newQty } }
                    : i
            )
        )
        router.put(`/cart/${id}/update`, { id, quantity: newQty }, { preserveScroll: true })
    }

    const decreaseQuantity = (id) => {
        const item = cartItems.find(i => i.id === id)
        if (!item || !item.pivot || typeof item.pivot.quantity !== 'number') return
        const currentQty = item.pivot.quantity
        if (currentQty <= 1) {
            alert("Quantity cannot be less than 1.")
            return
        }
        const newQty = currentQty - 1
        setCartItems(prev =>
            prev.map(i =>
                i.id === id
                    ? { ...i, pivot: { ...i.pivot, quantity: newQty } }
                    : i
            )
        )
        router.put(`/cart/${id}/update`, { id, quantity: newQty }, { preserveScroll: true })
    }

    const handleQuantityChange = (id, value, event = null) => {
        const cleanValue = value.replace(/[^\d]/g, "")
        const numValue = parseInt(cleanValue, 10) || 1
        const item = cartItems.find(i => i.id === id)
        if (!item) return
        const quantity = Math.min(Math.max(1, numValue), item.stock)
        if (numValue > item.stock) {
            alert(`Sorry, only ${item.stock} units available in stock.`)
        }
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id
                    ? { ...item, pivot: { ...item.pivot, quantity } }
                    : item
            )
        )
        clearTimeout(quantityTimers.current[id])
        const sendUpdate = () => {
            router.put(`/cart/${id}/update`, { id, quantity }, { preserveScroll: true })
        }
        if (event?.type === "keydown" && event.key === "Enter") {
            sendUpdate()
        } else {
            quantityTimers.current[id] = setTimeout(sendUpdate, 500)
        }
    }

    const deleteSelectedItems = () => {
        const selectedIds = cartItems.filter(item => item.selected).map(item => item.id)
        if (selectedIds.length > 0) {
            const queryString = selectedIds.map(id => `ids[]=${id}`).join('&')
            clearForm.delete(`/cart/clear?${queryString}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setCartItems(cartItems.filter(item => !item.selected))
                    setAllSelected(false)
                }
            })
        }
    }

    const deleteItem = (id) => {
        deleteForm.delete(`/cart/${id}/remove`, {
            preserveScroll: true,
            onSuccess: () => {
                setCartItems(cartItems.filter(item => item.id !== id))
            }
        })
    }

    const selectedItemCount = cartItems.filter(item => item.selected).length

    const calculateSubtotal = () => {
        return cartItems
            .filter(item => item.selected)
            .reduce((total, item) => total + (item.price * item.pivot.quantity), 0)
    }

    const handleCheckout = (e) => {
        e.preventDefault()
        const selectedItemIds = cartItems.filter(item => item.selected).map(item => item.id)
        if (selectedItemIds.length === 0) {
            alert("Please select at least one item to checkout")
            return
        }
        if (!selectedAddress) {
            alert("Please select a shipping address")
            return
        }
        setIsCheckingOut(true)
        checkoutForm.data.selected_items = selectedItemIds
        checkoutForm.data.shipping_address_id = selectedAddress.id
        checkoutForm.post('/order/store', {
            preserveScroll: true,
            onSuccess: (page) => {
                setCartItems(prevItems => prevItems.filter(item => !item.selected))
                setAllSelected(false)
                setShowSuccessMessage(true)
                setIsCheckingOut(false)
                setTimeout(() => {
                    setShowSuccessMessage(false)
                    const orderId = page.props.order?.id
                    if (orderId) {
                        window.location.href = `/order/${orderId}`
                    }
                }, 1000)
            },
            onError: (errors) => {
                console.error("Checkout failed:", errors)
                alert("Failed to checkout. Please try again.")
                setIsCheckingOut(false)
            }
        })
    }

    const subtotal = calculateSubtotal()

    return (
        <>
            <div className="mx-[10%] mt-20 bg-white shadow-md rounded-xl ">
                <CartActions
                    allSelected={allSelected}
                    toggleSelectAll={toggleSelectAll}
                    deleteSelectedItems={deleteSelectedItems}
                    selectedItemCount={selectedItemCount}
                    cartItemsLength={cartItems.length}
                />

                {/* Cart Items */}
                {cartItems.length > 0 ? (
                    <CartItemList
                        cartItems={cartItems}
                        toggleSelectItem={toggleSelectItem}
                        increaseQuantity={increaseQuantity}
                        decreaseQuantity={decreaseQuantity}
                        deleteItem={deleteItem}
                        handleQuantityChange={handleQuantityChange}
                        products={products}
                    />
                ) : (
                    <div className="m-4 p-8 text-center bg-white shadow-md rounded-xl">
                        <p className="text-gray-500">Your cart is empty</p>
                    </div>
                )}

                <AddressBlock
                    user={user}
                    shippingAddresses={shippingAddresses}
                    onAddressSelected={handleAddressSelected}
                />

                {/* Order Summary */}
                <CartSummary
                    selectedItemCount={selectedItemCount}
                    subtotal={subtotal}
                    selectedAddress={selectedAddress}
                />

                {/* order place event and listener */}
                <SendorderConfirmation orderPlacedNotification={orderPlacedNotification} orderPlacedMessage={orderPlacedMessage} />

                {/* Checkout Button */}
                <CheckoutButton
                    handleCheckout={handleCheckout}
                    selectedItemCount={selectedItemCount}
                    selectedAddress={selectedAddress}
                    isCheckingOut={isCheckingOut}
                />
            </div>
        </>
    )
}

export default CartDetail
