import React from 'react'
import { useState, useEffect } from "react"

function ShowSaleReminder({showSalesPopup}) {
        const [isPopupVisible, setIsPopupVisible] = useState(showSalesPopup)
        console.log("showSalesPopup", showSalesPopup)

        // Effect to handle popup visibility based on showSalesPopup prop
    useEffect(() => {
        // Show sales popup if the condition is met
        if (showSalesPopup) {
            setIsPopupVisible(true)
        }
    }, [showSalesPopup])


        const handleClosePopup = () => {
        // Function to close the sales popup
        setIsPopupVisible(false)
    }

  return (
    <>
   {isPopupVisible && (
    <div className="bg-gradient-to-br px-[10%] from-red-200 to-orange-200 p-8 border border-orange-300 shadow-xl rounded-lg text-left relative animate-fade-in">
        {/* Close Button */}
        <button onClick={handleClosePopup} className="absolute top-4 right-[10%] text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
        </button>

        {/* Icon (Halimbawa: Bell) */}
        <div className="flex items-center mb-4">
            <svg className="h-8 w-8 text-red-500 mr-3 fill-current" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.77-4-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68c-2.37.55-4 3.25-4 6.32v5h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2z"/>
            </svg>
            <h2 className="text-red-600 font-bold text-2xl">Big Sales Event!</h2>
        </div>

        {/* Mas Detalyadong Mensahe */}
        <p className="text-gray-700 mb-4">
            Hurry! Get up to <span className="font-semibold text-green-500">50% off</span> on selected items today only!
            Don't miss out on these amazing deals.
        </p>
    </div>
)}
    </>
  )
}

export default ShowSaleReminder
