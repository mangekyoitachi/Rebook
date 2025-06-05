import React, { useState } from "react"
import logo from "../../../../public/Assets/logo.png"
import { Link } from "@inertiajs/react"

export default function Header({ user,searchProduct }) {
    const [searchTerm, setSearchTerm] = useState('')

    const handleSearchChange = (value) => {
        setSearchTerm(value)
        if (typeof searchProduct === 'function') {
            searchProduct(value)
        }
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (typeof searchProduct === 'function') {
            searchProduct(searchTerm)
        }
    }

    return (
        <div className="flex flex-row w-full justify-center items-center py-5">
            {/* Logo */}
            <Link href="/dashboard">
                <img
                    src={logo}
                    alt="Re:Book"
                    className="w-64 sm:w-48 lg:w-56 m-4"
                />
            </Link>
            {/* Search and Icons */}
            <div className="w-[60%]">
                <div className="flex flex-row items-center justify-end mt-4 mb-2">
                    {/* Search */}
                    <form onSubmit={handleSearchSubmit} className="flex items-center w-full border border-red-800 rounded-full p-1 pl-5 pr-2">
                        <input
                            type="text"
                            placeholder="Search our catalog"
                            value={searchTerm}
                            className="flex-grow bg-transparent outline-none w-[65%] text-red-800 placeholder-red-800"
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                        <button type="submit" className="p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-red-800">
                                <path d="M10 2a8 8 0 105.293 14.293l5.707 5.707 1.414-1.414-5.707-5.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z"/>
                            </svg>
                        </button>
                    </form>
                    {/* Icons */}
                    <span className="flex gap-x-8 mx-[3%]">
                        {/* Profile */}
                        <Link href="/profile" className="text-red-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <circle cx="12" cy="8" r="4" strokeWidth="2" />
                                <path d="M6 20c0-4 3-7 6-7s6 3 6 7" strokeWidth="2" />
                            </svg>
                        </Link>
                        {/* Cart */}
                        <Link href={`/cart/${user}`} className="text-red-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5H3m4 8v6a2 2 0 002 2h8a2 2 0 002-2v-6M9 17h6" />
                            </svg>
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    )
}
