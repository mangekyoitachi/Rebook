import React, { useState, useEffect } from 'react';

function SendorderConfirmation({ orderPlacedNotification, orderPlacedMessage }) {
    const [showNotification, setShowNotification] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        if (orderPlacedNotification) {
            setShowNotification(true);
            const timer = setTimeout(() => setShowNotification(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [orderPlacedNotification]);

    useEffect(() => {
        if (orderPlacedMessage) {
            setShowMessage(true);
            const timer = setTimeout(() => setShowMessage(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [orderPlacedMessage]);

    return (
        <div className="m-8">
            {showNotification && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Success!</strong>
                    <span className="block sm:inline"> Your order has been placed successfully!</span>
                </div>
            )}
            {showMessage && (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mt-2" role="alert">
                    <strong className="font-bold">Info:</strong>
                    <span className="block sm:inline"> {orderPlacedMessage}</span>
                </div>
            )}
        </div>
    );
}

export default SendorderConfirmation;
