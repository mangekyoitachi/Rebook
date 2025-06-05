import React from "react";

function CartActions({ allSelected, toggleSelectAll, deleteSelectedItems, selectedItemCount, cartItemsLength }) {
  return (
    <div className="flex justify-between items-center m-4 mb-4 p-3 bg-white shadow-md rounded-xl border-gray-200">
      <div className=" m-4 flex items-center">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={toggleSelectAll}
          className="w-4 h-4 mr-2"
        />
        <span>Select All ({cartItemsLength})</span>
      </div>
      <button
        onClick={deleteSelectedItems}
        disabled={!selectedItemCount}
        className="text-red-600 hover:text-red-800 disabled:text-gray-400"
      >
        Delete
      </button>
    </div>
  );
}

export default CartActions;
