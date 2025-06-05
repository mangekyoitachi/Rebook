import React, { useState, useEffect } from "react"
import { useForm, router } from '@inertiajs/react'
import logo from "../../../../../public/Assets/logo.png"
import { Link } from "@inertiajs/react"

export default function Register({ user }) {
    const [showCreateShop, setShowCreateShop] = useState(false)
    const { data, setData, post, processing, errors } = useForm({
        shop_name: '',
        description: '',
    })

    useEffect(() => {
        if (user.role === 'seller') {
            setShowCreateShop(true)
        }
    }, [user.role])

    const handleSubmit = (e) => {
        e.preventDefault()
        post('/create-shop', {
            onSuccess: () => {
                router.put('/become-a-seller', {}, {
                    onSuccess: () => console.log('User role updated to seller'),
                    onError: () => console.log('Failed to update user role'),
                })
            },
            onError: () => {
                console.log('Shop creation failed')
            },
        })
    }

    return (
        <>
            <main className="mx-[10%] px-4 mt-40 ">
                <div className="flex flex-row justify-around items-start">
                    <div className="max-w-lg">
                        <h1 className="text-5xl font-bold text-gray-800 mb-6">
                            Grow your school supplies business with{" "}
                            <span className="text-black">
                                Re:<span className="text-red-800">Book</span>
                            </span>{" "}
                            today!
                        </h1>
                        <p className="text-lg text-gray-700">
                            Sell your school supplies on Re:Book. Our easy-to-use platform connects
                            you with students, parents, and educators. From notebooks to backpacks,
                            Re:Book helps you boost visibility and grow sales effortlessly.
                        </p>
                    </div>
                    {!showCreateShop && (
                        <section className="bg-white p-6 rounded-xl shadow-md w-[30%] flex flex-col">
                            <div className="flex justify-center items-center">
                                <img src={logo} alt="Logo" className="w-[70%] m-8" />
                            </div>
                            <div className="text-center m-4 font-bold text-2xl">
                                Do you want to register as a seller?
                            </div>
                            <div className="flex flex-row items-center justify-between m-4 mt-12">
                                <Link
                                    href={"/become-a-seller"}
                                    method={"put"}
                                    className="bg-green-600 rounded-xl font-bold text-white shadomd flex"
                                >
                                    <p className="m-4 ml-12 mr-12">Yes</p>
                                </Link>
                                <Link
                                    href="/dashboard"
                                    method="get"
                                    className="bg-red-600 rounded-xl font-bold text-white shadow-md flex"
                                >
                                    <p className="m-4 ml-12 mr-12">No</p>
                                </Link>
                            </div>
                        </section>
                    )}
                    {showCreateShop && (
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white p-4 w-120 rounded-xl shadow-md"
                        >
                            <div className="m-2 text-2xl font-bold">Shop</div>
                            <input
                                type="text"
                                placeholder="Enter your shop name"
                                value={data.shop_name}
                                onChange={(e) => setData('shop_name', e.target.value)}
                                className="border border-gray-300 bg-white shadow-md rounded-xl p-4 w-full mb-4"
                            />
                            {errors.shop_name && (
                                <div className="text-red-500 text-sm mt-1">{errors.shop_name}</div>
                            )}
                            <div className="m-2 text-2xl font-bold">Decsription</div>
                            <textarea
                                placeholder="Optional description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="border border-gray-300 bg-white shadow-md p-4 rounded-xl w-full mt-2"
                            />
                            {errors.description && (
                                <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                            )}
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 text-white mt-4 p-2 px-6 rounded hover:bg-blue-700"
                            >
                                {processing ? 'Submitting...' : 'Submit'}
                            </button>
                        </form>
                    )}
                </div>
            </main>
        </>
    )
}
