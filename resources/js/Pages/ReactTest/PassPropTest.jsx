import { useState } from "react";

function PassPropTest({
  carts,
  cartItems,
  categories,
  orders,
  orderItems,
  payments,
  products,
  reviews,
  shippings,
  shops,
  users,
}) {
  const [activeTab, setActiveTab] = useState("renderDataCard");
  const [expandedSection, setExpandedSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Calculate stats for overview
  const stats = [
    { title: "Total Users", value: users?.length || 0, icon: "👤" },
    { title: "Total Products", value: products?.length || 0, icon: "📦" },
    { title: "Total Orders", value: orders?.length || 0, icon: "🛍️" },
    { title: "Total Revenue", value: `${payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0}`, icon: "💰" },
  ];

  const filterData = (data) => {
    if (!searchQuery || !data) return data;

    return data.filter(item => {
      return Object.values(item).some(value =>
        value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  const renderDataCard = (title, data, icon, primaryKey, secondaryKeys) => {
    if (!data) return null;

    const filteredData = filterData(data);

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div
          className="flex justify-between items-center p-4 bg-blue-50 cursor-pointer"
          onClick={() => toggleSection(title.toLowerCase())}
        >
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              {icon}
            </div>
            <h2 className="font-bold text-lg">{title} ({filteredData.length})</h2>
          </div>
          {expandedSection === title.toLowerCase() ? "▲" : "▼"}
        </div>

        {expandedSection === title.toLowerCase() && (
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(data[0]).map(key => (
                      <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr key={item[primaryKey]} className="hover:bg-gray-50">
                      {Object.entries(item).map(([key, value]) => (
                        <td key={`${item[primaryKey]}-${key}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {typeof value === 'object' ? JSON.stringify(value) : value?.toString() || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderOverview = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center">
            🛍️ Recent Orders
          </h3>
          <div className="space-y-4">
            {(orders || []).slice(0, 5).map(order => (
              <div key={order.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">User ID: {order.user_id}</p>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                  <p className="text-right font-bold mt-1">${order.total}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center">
            ⭐ Recent Reviews
          </h3>
          <div className="space-y-4">
            {(reviews || []).slice(0, 5).map(review => {
              const product = products?.find(p => p.id === review.product_id);
              const user = users?.find(u => u.id === review.user_id);

              return (
                <div key={review.id} className="border-b pb-2">
                  <div className="flex justify-between">
                    <p className="font-medium">{product?.name || `Product #${review.product_id}`}</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm italic my-1">"{review.comment}"</p>
                  <p className="text-xs text-gray-500">By {user?.name || `User #${review.user_id}`}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">E-commerce Dashboard</h1>

          <div className="w-full md:w-64 relative">
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>

        <div className="mb-6 bg-white rounded-lg shadow-md p-1">
          <div className="flex flex-wrap">
            <button
              className={`px-4 py-2 rounded-md ${activeTab === 'overview' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 rounded-md ${activeTab === 'data' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveTab('data')}
            >
              All Data
            </button>
          </div>
        </div>

        {activeTab === 'overview' ? (
          renderOverview()
        ) : (
          <div className="space-y-6">
            {renderDataCard("Users", users, "👤", "id", ["name", "email", "role"])}
            {renderDataCard("Products", products, "📦", "id", ["name", "price", "stock"])}
            {renderDataCard("Categories", categories, "🏷️", "id", ["name"])}
            {renderDataCard("Shops", shops, "🏪", "id", ["shop_name", "seller_id"])}
            {renderDataCard("Orders", orders, "🛍️", "id", ["status", "total", "user_id"])}
            {renderDataCard("Order Items", orderItems, "📋", "id", ["product_id", "quantity", "price"])}
            {renderDataCard("Carts", carts, "🛒", "id", ["user_id"])}
            {renderDataCard("Cart Items", cartItems, "📋", "id", ["product_id", "quantity"])}
            {renderDataCard("Payments", payments, "💳", "id", ["amount", "status", "transaction_id"])}
            {renderDataCard("Shippings", shippings, "🚚", "id", ["city_name", "country", "user_id"])}
            {renderDataCard("Reviews", reviews, "⭐", "id", ["rating", "comment", "product_id"])}
          </div>
        )}
      </div>
    </div>
  );
}

export default PassPropTest;
