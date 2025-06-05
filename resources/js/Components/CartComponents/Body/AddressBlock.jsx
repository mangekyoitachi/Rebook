import React, { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';

export default function AddressBlock({ user, shippingAddresses, onAddressSelected }) { // Receive the prop
    const [addresses, setAddresses] = useState(shippingAddresses || []);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
      const [selectedLocalAddressId, setSelectedLocalAddressId] = useState(null);

    const addressForm = useForm({
        address: '',
        city_name: '',
        zip_code: '',
        country: ''
    });

    useEffect(() => {
        setAddresses(shippingAddresses || []);
    }, [shippingAddresses]);


    const handleAddAddress = (e) => {
        e.preventDefault();

        addressForm.post('/shipping/post', {
            preserveScroll: true,
            onSuccess: (page) => {
                const newAddress = page.props.shipping_address;
                if (newAddress) {
                    setAddresses(prev => [...prev, newAddress]);
                }
                setShowAddForm(false);
                addressForm.reset();
            },
            onError: (errors) => {
                console.error("Failed to create address:", errors);
            }
        });
    };

    const handleEditAddress = (address) => {
        setEditingAddress(address.id);
        addressForm.setData({
            address: address.address,
            city_name: address.city_name,
            zip_code: String(address.zip_code),
            country: address.country
        });
        setShowAddForm(true);
    };

    const handleUpdateAddress = (e) => {
        e.preventDefault();

        addressForm.put(`/shipping/${editingAddress}/update`, {
            preserveScroll: true,
            onSuccess: (page) => {
                const updatedAddress = page.props.shipping_address;
                if (updatedAddress) {
                    setAddresses(prev =>
                        prev.map(addr =>
                            addr.id === editingAddress ? updatedAddress : addr
                        )
                    );
                }
                setShowAddForm(false);
                setEditingAddress(null);
                addressForm.reset();
            },
            onError: (errors) => {
                console.error("Failed to update address:", errors);
            }
        });
    };

    const deleteForm = useForm({});

    const handleDeleteAddress = (addressId) => {
        if (confirm('Are you sure you want to delete this address?')) {
            deleteForm.delete(`/shipping/${addressId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setAddresses(prev => prev.filter(addr => addr.id !== addressId));
                },
                onError: (errors) => {
                    console.error("Failed to delete address:", errors);
                },
            });
        }
    };

    const handleCancelForm = () => {
        setShowAddForm(false);
        setEditingAddress(null);
        addressForm.reset();
    };

    const handleSelectAddress = (addressId) => {
        setSelectedLocalAddressId(addressId); // Update local state in AddressBlock
        console.log('Selected local address ID in AddressBlock:', addressId); // Add this for debugging
        if (onAddressSelected) {
            onAddressSelected(addressId); // Call the function passed from CartDetail
        }
    };

    return (
        <section className="m-4 bg-white rounded-xl shadow-md">
            {/* Header */}
            <div className="m-4 mt-8 flex flex-row justify-between items-center">
                <p className="font-medium text-lg">Address</p>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-green-400 p-2 px-4 text-white rounded-md shadow-md hover:bg-green-500 transition-colors"
                >
                    Add Address
                </button>
            </div>

            <div className="px-4 pb-4">
                {/* Address List */}
                {addresses.length > 0 ? (
                    <div className="space-y-3 mb-4">
                        {addresses.map((address) => (
                            <div
                                key={address.id}
                                className={`border rounded-lg p-4 hover:border-gray-300 transition-colors ${selectedLocalAddressId === address.id ? 'border-red-500' : 'border-gray-200'}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="text-gray-600 mt-1">
                                            <div className="font-medium text-gray-900 mb-1">{address.address}</div>
                                            <div>{address.city_name}, {address.zip_code}</div>
                                            <div>{address.country}</div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-2 ml-4 items-center">
                                        <button
                                            onClick={() => handleSelectAddress(address.id)}
                                            className="text-green-500 hover:text-green-700 text-sm font-medium"
                                        >
                                            Select
                                        </button>
                                        <button
                                            onClick={() => handleEditAddress(address)}
                                            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAddress(address.id)}
                                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    !showAddForm && (
                        <div className="text-center py-8 text-gray-500">
                            <div className="text-lg mb-2">No addresses available</div>
                            <div className="text-sm">Add your first shipping address to get started</div>
                        </div>
                    )
                )}

                {/* Add/Edit Address Form */}
                {showAddForm && (
                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                        <h3 className="text-lg font-medium mb-4">
                            {editingAddress ? 'Edit Address' : 'Add New Address'}
                        </h3>

                        <form onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress} className="space-y-4">
                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address *
                                </label>
                                <textarea
                                    value={addressForm.data.address}
                                    onChange={(e) => addressForm.setData('address', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Street address, apartment, suite, etc."
                                    required
                                />
                                {addressForm.errors.address && (
                                    <p className="text-red-500 text-sm mt-1">{addressForm.errors.address}</p>
                                )}
                            </div>

                            {/* City and Zip Code */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        City Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={addressForm.data.city_name}
                                        onChange={(e) => addressForm.setData('city_name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    />
                                    {addressForm.errors.city_name && (
                                        <p className="text-red-500 text-sm mt-1">{addressForm.errors.city_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Zip Code *
                                    </label>
                                    <input
                                        type="text"
                                        value={addressForm.data.zip_code}
                                        onChange={(e) => addressForm.setData('zip_code', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    />
                                    {addressForm.errors.zip_code && (
                                        <p className="text-red-500 text-sm mt-1">{addressForm.errors.zip_code}</p>
                                    )}
                                </div>
                            </div>

                            {/* Country */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Country *
                                </label>
                                <input
                                    type="text"
                                    value={addressForm.data.country}
                                    onChange={(e) => addressForm.setData('country', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Country"
                                    required
                                />
                                {addressForm.errors.country && (
                                    <p className="text-red-500 text-sm mt-1">{addressForm.errors.country}</p>
                                )}
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={addressForm.processing}
                                    className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                >
                                    {addressForm.processing
                                        ? 'Saving...'
                                        : editingAddress
                                            ? 'Update Address'
                                            : 'Save Address'
                                    }
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCancelForm}
                                    className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </section>
    );
}
