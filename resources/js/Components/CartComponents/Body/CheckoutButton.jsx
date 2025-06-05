import React from "react";

function CheckoutButton({ handleCheckout, selectedItemCount, selectedAddress, isCheckingOut }) {
  return (
    <div className="m-4 bg-white border-gray-200 rounded flex flex-col">
      <button
        onClick={handleCheckout}
        disabled={selectedItemCount === 0 || !selectedAddress || isCheckingOut}
        className={`m-4 mt-4 py-2 rounded font-medium ${
          selectedItemCount > 0 && selectedAddress
            ? isCheckingOut ? 'bg-yellow-500 text-white cursor-wait' : 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isCheckingOut ? 'Processing...' : (!selectedAddress ? 'Select Address to Proceed' : `Checkout (${selectedItemCount})`)}
      </button>
    </div>
  );
}

export default CheckoutButton;
