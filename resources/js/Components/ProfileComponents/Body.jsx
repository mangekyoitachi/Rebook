import React, { useState } from "react"
import { Link } from "@inertiajs/react"

import Profile from "./Profile"
import Purchase from "./Purchase"
import PurchaseNotification from "./Body/PurchaseNotification"

import store from "../../../../public/Assets/Profile/Menu/store.png"
import userIcon from "../../../../public/Assets/Profile/Menu/user.png"
import bell from "../../../../public/Assets/Profile/Menu/bell.png"
import task from "../../../../public/Assets/Profile/Menu/task.png"
import exit from "../../../../public/Assets/Profile/Menu/exit.png"
import PurchaseNavigation from "./Body/PurchaseNavigation"

export default function Body({ user, orders, orderItems, products }) {
    // State to manage the expanded menu items
    const [expandedMenu, setExpandedMenu] = useState({
        myAccount: false,
        // myPurchase: false,
        // notification: false,
    })

    // Function to toggle the expanded state of a menu item
    const toggleMenu = (menu) => {
        setExpandedMenu(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }))
        setActiveComponent('profile')
    }

    // This will determine which component to render in the main area
    const [activeComponent, setActiveComponent] = useState('profile')

    // Function to get the first letter of user's name
    const getFirstLetter = () => {
        return user?.name ? user.name.charAt(0).toUpperCase() : 'U'
    }

    return (
        <>
            <div className="mx-[10%] flex h-auto mt-20 rounded-xl bg-white shadow-md mb-20">
                <div className="w-md flex flex-col items-center m-4">
                    <div className="w-full h-24 flex flex-row justify-start items-center bg-white shadow-md rounded-xl mb-4">
                        <div className="bg-purple-500 ml-4 text-white w-14 h-12 rounded-full shadow-md flex items-center justify-center">
                            {/* First letter of user without uploaded image */}
                            <span className="text-xl font-semibold">{getFirstLetter()}</span>
                        </div>
                        {/* --- ACCOUNT DESCRIPTION --- */}
                        <div className="w-full flex flex-row justify-around ">
                            <p>{user.name}</p>
                            {/* <div>Edit</div> */}
                        </div>
                    </div>
                    {/* --- MENU --- */}
                    <div className="w-full h-auto p-4 space-y-4 bg-white shadow-md rounded-xl flex-col">
                        <button
                            onClick={() => toggleMenu('myAccount')}
                            className="w-full flex flex-row justify-start items-center gap-x-4 bg-white shadow-md rounded-md"
                        >
                            <img
                                src={userIcon}
                                alt=""
                                className="h-5 w-5 m-4"
                            />
                            <p>
                                My Account
                            </p>
                        </button>
                        {expandedMenu.myAccount && (
                            <div className="ml-8 mt-1 space-y-1">
                                <button className="w-full text-left py-2 text-gray-700 hover:text-orange-500 transition-colors">
                                    Profile
                                </button>
                                <button className="w-full text-left py-2 text-gray-700 hover:text-orange-500 transition-colors">
                                    Change Password
                                </button>
                                {/* <button className="w-full text-left py-2 px-1 text-gray-700 hover:text-orange-500 transition-colors">
                                    Privacy Settings
                                </button>
                                <button className="w-full text-left py-2 px-1 text-gray-700 hover:text-orange-500 transition-colors">
                                    Notification Settings
                                </button> */}
                            </div>
                        )}
                        <button
                            onClick={() => setActiveComponent('purchase')}
                            className="w-full flex flex-row justify-start items-center gap-x-4 bg-white shadow-md rounded-md"
                        >
                            <img
                                src={task}
                                alt=""
                                className="h-5 w-5 m-4"
                            />
                            <p>
                                My Purchase
                            </p>
                        </button>
                        <button
                            onClick={() => setActiveComponent('notification')}
                            className="w-full flex flex-row justify-start items-center gap-x-4 bg-white shadow-md rounded-md"
                        >
                            <img
                                src={bell}
                                alt=""
                                className="h-5 w-5 m-4"
                            />
                            <p>
                                Notification
                            </p>
                        </button>
                        <Link
                            href={'/become-a-seller'}
                            className="w-full flex flex-row justify-start items-center gap-x-4 bg-white shadow-md rounded-md"
                        >
                            <img
                                src={store}
                                alt=""
                                className="h-5 w-5 m-4"
                            />
                            <p>
                                Become seller
                            </p>
                        </Link>
                        <Link
                            href={'/logout'}
                            method={'post'}
                            className="w-full flex flex-row justify-start items-center gap-x-4 bg-white shadow-md rounded-md"
                        >
                            <img
                                src={exit}
                                alt=""
                                className="h-5 w-5 m-4"
                            />
                            <p>
                                Logout
                            </p>
                        </Link>
                    </div>
                </div>
                {activeComponent === 'profile' && <Profile user={user} />}
                {activeComponent === 'purchase' && <Purchase user={user} orders={orders} orderItems={orderItems} products={products} />}
                {activeComponent === 'notification' && <PurchaseNotification />}
            </div>
        </>
    )
}
