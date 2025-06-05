import React, { useState, useEffect } from "react";

export default function Purchase({ user, orders = [], orderItems = [], products }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    // Combine orders with their items
    const ordersWithItems = orders.map(order => {
      const items = orderItems.filter(item => item.order_id === order.id);
      return {
        ...order,
        items: items,
        totalItems: items.length,
        totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0)
      };
    });

    // Filter orders
    const newFilteredOrders = ordersWithItems.filter(order => {
      const matchesSearch = !searchTerm || order.items.some(item => {
        const product = products.find(p => p.id === item.product_id);
        return product && product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    setFilteredOrders(newFilteredOrders);
  }, [orders, orderItems, products, searchTerm, statusFilter]);

  const formatPrice = (price) => {
    return `₱${parseFloat(price).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white w-full m-4 shadow-md rounded-xl">

      <div className="m-4 flex flex-col items-start justify-between bg-white shadow-md rounded-xl">
        <h2 className="text-xl font-bold m-4">My Purchases</h2>

        <div className="flex w-full">
            {/* Search */}
            <input
                type="text"
                placeholder="Search by product name..."
                className="p-2 w-full border-gray-400 rounded-xl m-4 bg-white shadow-md flex"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>



      {/* Status Filter */}
      <div className="flex gap-2 m-4 bg-white shadow-md rounded-xl">
        {['all', 'completed', 'pending', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-1 m-4 rounded-md shadow-md text-sm capitalize ${
              statusFilter === status
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-6 m-4 py-4 bg-white shadow-md rounded-xl">
        {filteredOrders.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            <div className="text-4xl mb-2">📦</div>
            <p>No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="m-4 bg-white shadow-lg rounded-xl">
              {/* Order Header */}
              <div className="flex justify-between items-start m-4">
                <div>
                  <h3 className="font-medium">Order #{order.id}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.totalItems} item(s) • Qty: {order.totalQuantity}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs capitalize ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="m-4 bg-gray-50 rounded-xl shadow-md p-3 mb-3">
                <h4 className="text-sm font-medium mb-2">Items:</h4>
                <div className="space-y-1">
                  {order.items.map((item) => {
                    const product = products.find((p) => p.id === item.product_id);
                    return (
                      product && (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>Product name: {product.name}</span>
                          <span>Qty: {item.quantity} × {formatPrice(item.price)}</span>
                        </div>
                      )
                    );
                  })}
                </div>
              </div>

              {/* Order Total and Actions */}
              <div className="m-4 mb flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">{formatPrice(order.total)}</p>
                  <p className="text-xs text-gray-500 mb-4">Total Amount</p>
                </div>
                <div className="space-x-2">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                    View Details
                  </button>
                  {order.status === 'completed' && (
                    <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                      Buy Again
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {filteredOrders.length > 0 && (
        <div className="m-4 mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
          Showing {filteredOrders.length} of {orders.length} orders
          {statusFilter !== 'all' && ` with status "${statusFilter}"`}
        </div>
      )}
    </div>
  );
}
