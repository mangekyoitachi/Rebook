import React, { useState, useRef, useEffect } from "react"
import logo from "../../../../../public/Assets/logo.png"
import { Link, useForm } from "@inertiajs/react"
import ProductList from "./Order/ProductList"

function Order({ orders, orderItems, user, shippings, allUsers }) {
    const [activeTab, setActiveTab] = useState("To Ship")
    const [filteredOrders, setFilteredOrders] = useState([])
    const [filteredOrderItems, setFilteredOrderItems] = useState([])

    useEffect(() => {
        if (activeTab === "To Ship") {
            const toShipOrders = orders.filter(order => order.status === "pending")
            const toShipOrderItems = orderItems.filter(item =>
                toShipOrders.some(order => order.id === item.order_id)
            )
            setFilteredOrders(toShipOrders)
            setFilteredOrderItems(toShipOrderItems)
        } else if (activeTab === "Complete") {
            const completeOrders = orders.filter(order => order.status === "completed")
            const completeOrderItems = orderItems.filter(item =>
                completeOrders.some(order => order.id === item.order_id)
            )
            setFilteredOrders(completeOrders)
            setFilteredOrderItems(completeOrderItems)
        } else if (activeTab === "Cancelled") {
            const cancelledOrders = orders.filter(order => order.status === "cancelled")
            const cancelledOrderItems = orderItems.filter(item =>
                cancelledOrders.some(order => order.id === item.order_id)
            )
            setFilteredOrders(cancelledOrders)
            setFilteredOrderItems(cancelledOrderItems)
        }
    }, [activeTab, orders, orderItems])

    return (
        <div className="bg-white mt-20 mb-20">
            {/* Tabs */}
            <div className="mx-[10%] bg-white shadow-md rounded-xl">
                <h2 className="text-3xl m-4 font-bold">Order Details</h2>
                <div className="flex space-x-4 m-4">
                    <button
                        onClick={() => setActiveTab("To Ship")}
                        className={`px-4 py-2 rounded ${activeTab === "To Ship" ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        To Ship
                    </button>
                    <button
                        onClick={() => setActiveTab("Complete")}
                        className={`px-4 py-2 rounded ${activeTab === "Complete" ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Complete
                    </button>
                    <button
                        onClick={() => setActiveTab("Cancelled")}
                        className={`px-4 py-2 rounded ${activeTab === "Cancelled" ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Cancelled
                    </button>
                </div>
                <ProductList
                    orders={filteredOrders}
                    orderItems={filteredOrderItems}
                    shippings={shippings}
                    allUsers={allUsers}
                />
            </div>
        </div>
    )
}

export default Order
