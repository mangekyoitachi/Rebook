import React from "react";
import { useForm, router } from '@inertiajs/react';

export default function Profile({ user }) {
    // routes
    // user profile
    // Route::get('/profile', [ProfileController::class, 'showProfile'])->name('user.profile');
    // Route::put('/profile/update', [ProfileController::class, 'updateProfile'])->name('user.profile.update');

    // protected $fillable = [
    //     'seller_id',
    //     'name',
    //     'image',
    //     'email',
    //     'password',
    //     'role',
    //     'created_at',
    //     'updated_at',
    // ];

    const { data, setData, put, processing, errors, isDirty, recentlySuccessful } = useForm({
        name: user.name || '',
        email: user.email || '',
        // phone: user.phone || '',
        // address: user.address || '',
        // gender: user.gender || '',
        // birth_date: user.birth_date || '',
        // birth_month: user.birth_month || '',
        // birth_year: user.birth_year || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleBirthDateChange = (field, value) => {
        setData(field, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put('/profile/update', {
            preserveScroll: true,
            onSuccess: () => {
                // Handle success (optional)
                console.log('Profile updated successfully');
            },
            onError: (errors) => {
                // Handle errors (optional)
                console.log('Update failed:', errors);
            }
        });
    };

    return (
        <>
            <div className="w-full h-auto m-4 flex flex-col bg-white shadow-md rounded-xl">
                <div className="h-20 m-4 bg-white shadow-md rounded-xl">
                    <div className="m-4 flex flex-row justify-between items-start">
                        <p className="text-xl font-bold">My Profile</p>
                        {/* <p>Manage and protect your account</p> */}
                    </div>
                </div>

                <div className="h-full m-4 flex">
                    <div className="w-full mx-auto m-4 p-4 flex justify-between items-start">
                        <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-8">

                            {/* Success Message */}
                            {recentlySuccessful && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                    Profile updated successfully!
                                </div>
                            )}

                            <div className="flex items-center">
                                <label className="w-32 text-right text-gray-500 text-sm pr-4">Name</label>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        onChange={handleChange}
                                        className={`w-full border rounded p-2 text-sm ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center">
                                <label className="w-32 text-right text-gray-500 text-sm pr-4">Email</label>
                                <div className="flex-1 flex items-center">
                                    <input
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={handleChange}
                                        className={`flex-1 border rounded p-2 text-sm mr-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center">
                                <label className="w-32 text-right text-gray-500 text-sm pr-4">Phone Number</label>
                                <div className="flex-1">
                                    <input
                                        disabled
                                        type="text"
                                        name="phone"
                                        value={data.phone}
                                        onChange={handleChange}
                                        className={`w-full border rounded p-2 text-sm ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center">
                                <label className="w-32 text-right text-gray-500 text-sm pr-4">Address</label>
                                <div className="flex-1">
                                    <input
                                        disabled
                                        type="text"
                                        name="address"
                                        value={data.address}
                                        onChange={handleChange}
                                        className={`w-full border rounded p-2 text-sm ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.address && (
                                        <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center">
                                <label className="w-32 text-right text-gray-500 text-sm pr-4">Gender</label>
                                <div className="flex-1 flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            disabled
                                            type="radio"
                                            name="gender"
                                            value="Male"
                                            checked={data.gender === "Male"}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Male</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            disabled
                                            type="radio"
                                            name="gender"
                                            value="Female"
                                            checked={data.gender === "Female"}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Female</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            disabled
                                            type="radio"
                                            name="gender"
                                            value="Other"
                                            checked={data.gender === "Other"}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Other</span>
                                    </label>
                                </div>
                                {errors.gender && (
                                    <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                                )}
                            </div>

                            <div className="flex items-center">
                                <label className="w-32 text-right text-gray-500 text-sm pr-4">Date of birth</label>
                                <div className="flex-1 flex space-x-2">
                                    <div className="relative w-full">
                                        <select
                                            disabled
                                            className={`block appearance-none w-full bg-white border text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ${errors.birth_date ? 'border-red-500' : 'border-gray-300'}`}
                                            value={data.birth_date}
                                            onChange={(e) => handleBirthDateChange('birth_date', e.target.value)}
                                        >
                                            <option value="">Date</option>
                                            {[...Array(31)].map((_, i) => (
                                                <option key={i+1} value={i+1}>{i+1}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="relative w-full">
                                        <select
                                            disabled
                                            className={`block appearance-none w-full bg-white border text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ${errors.birth_month ? 'border-red-500' : 'border-gray-300'}`}
                                            value={data.birth_month}
                                            onChange={(e) => handleBirthDateChange('birth_month', e.target.value)}
                                        >
                                            <option value="">Month</option>
                                            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, i) => (
                                                <option key={i} value={month}>{month}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="relative w-full">
                                        <select
                                            disabled
                                            className={`block appearance-none w-full bg-white border text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ${errors.birth_year ? 'border-red-500' : 'border-gray-300'}`}
                                            value={data.birth_year}
                                            onChange={(e) => handleBirthDateChange('birth_year', e.target.value)}
                                        >
                                            <option value="">Year</option>
                                            {[...Array(100)].map((_, i) => {
                                                const year = 2025 - i;
                                                return <option key={year} value={year}>{year}</option>;
                                            })}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                {(errors.birth_date || errors.birth_month || errors.birth_year) && (
                                    <p className="text-red-500 text-xs mt-1">Please complete your birth date</p>
                                )}
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing || !isDirty}
                                    className={`font-medium py-2 px-4 rounded transition-colors ${
                                        processing || !isDirty
                                            ? 'bg-gray-400 cursor-not-allowed text-white'
                                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                                    }`}
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
