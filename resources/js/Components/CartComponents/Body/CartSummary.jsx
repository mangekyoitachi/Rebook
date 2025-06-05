import React from "react";

function CartSummary({ selectedItemCount, subtotal, selectedAddress }) {
  return (
    <div className="m-4 bg-white border-gray-200 rounded flex flex-col">
      <h3 className="m-4 font-medium mb-3">Order Summary</h3>

      <div className="m-4 flex justify-between mb-2">
        <span>Subtotal ({selectedItemCount} items)</span>
        <span>₱{subtotal.toFixed(2)}</span>
      </div>

      <div className="m-4 flex justify-between mb-4">
        <span>Shipping Fee</span>
        <span>₱0.00</span>
      </div>

      <div className="m-4 border-t border-gray-400 pt-3 flex justify-between">
        <span className="font-medium">Total</span>
        <span className="font-bold text-red-600">₱{subtotal.toFixed(2)}</span>
      </div>

      {/* Display Selected Address */}
      {selectedAddress && (
        <div className="m-4 bg-white border border-gray-200 rounded-xl shadow-md p-4">
          <h3 className="font-medium mb-2">Shipping To:</h3>
          <p className="text-gray-700">
            {selectedAddress.address}
          </p>
          <p className="text-gray-700">
            {selectedAddress.city_name}, {selectedAddress.zip_code}
          </p>
          <p className="text-gray-700">
            {selectedAddress.country}
          </p>
        </div>
      )}
    </div>
  );
}

export default CartSummary;
