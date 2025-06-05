import React, { useState, useCallback } from "react"
import { router } from "@inertiajs/react"

export default function ProductList({ orders, orderItems, shippings, allUsers }) {
    const [shippingIds, setShippingIds] = useState({})

    const getUserName = useCallback((userId) => {
        const user = allUsers.find(user => user.id === userId);
        return user ? user.name : 'Customer';
    }, [allUsers]);

    const getRelevantShippingId = useCallback((order) => {
        if (order?.shipping_id) {
            return order.shipping_id
        }
        if (shippings && shippings.length > 0) {
            const latestShipping = shippings.reduce((prev, current) =>
                (prev.id > current.id) ? prev : current
            )
            return latestShipping?.id
        }
        return shippingIds[order.id] || null
    }, [shippings, shippingIds])

    const handleStatusChange = useCallback((orderId, newStatus, currentStatus) => {
        // Check if order is already cancelled or completed
        if (currentStatus === 'cancelled' || currentStatus === 'completed') {
            alert(`Order #${orderId} cannot be modified because it is already ${currentStatus}.`);
            return;
        }

        if (newStatus === 'cancelled') {
            if (!confirm(`Are you sure you want to cancel order #${orderId}?`)) {
                return
            }
        }

        const data = { status: newStatus }

        if (newStatus === 'completed') {
            if (!confirm(`Are you sure you want to mark order #${orderId} as completed?`)) {
                return
            }
        }

        router.put(`/order/${orderId}/status`, data, {
            onSuccess: () => {
                alert(`Order #${orderId} status updated to ${newStatus}.`)
            },
            onError: () => {
                alert('Failed to update order status. Please try again.')
            },
        })
    }, [orders, getRelevantShippingId])

    const renderOrderRow = useCallback((order) => {
        const orderProducts = orderItems.filter(item => item.order_id === order.id)
        const firstProduct = orderProducts[0]
        const relevantShippingId = getRelevantShippingId(order)
        const orderedByUserName = getUserName(order.user_id);
        const isOrderFinal = order.status === 'cancelled' || order.status === 'completed';

        return (
            <div key={order.id} className="bg-white rounded-xl shadow-md p-4 grid grid-cols-4 items-center text-sm text-gray-800">
                <div className="flex items-center gap-3">
                    {firstProduct && (
                        <div className="flex items-center gap-3">
                            <img
                                src={firstProduct.product?.image_url || '/placeholder-image.jpg'}
                                alt={firstProduct.product?.name || 'Product'}
                                className="w-24 h-24 bg-gray-200 object-cover rounded-lg"
                            />
                            <div>
                                <p className="font-medium">{orderedByUserName}</p>
                                <p className="text-xs text-gray-500">{firstProduct.product?.name}</p>
                                {orderProducts.length > 1 && (
                                    <p className="text-xs text-gray-400">+{orderProducts.length - 1} more items</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <span className="font-semibold">₱{order.total}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                }`}>
                    {order.status}
                </span>
                <div>
                    <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value, order.status)}
                        disabled={isOrderFinal}
                        className={`w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isOrderFinal ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                        }`}
                    >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    {relevantShippingId && (
                        <p className="text-xs text-gray-500 mt-1">Shipping: {relevantShippingId}</p>
                    )}
                </div>
            </div>
        )
    }, [handleStatusChange, orderItems, getRelevantShippingId, getUserName]);

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-md shadow-md p-4 grid grid-cols-4 text-sm font-semibold text-gray-700">
                <span>Product(s)</span>
                <span>Order Total</span>
                <span>Status</span>
                <span>Actions</span>
            </div>
            <div className="space-y-4">
                {orders.map(renderOrderRow)}
            </div>
        </div>
    )
}
