import React, { useState, useEffect } from "react"
import { Link, usePage } from "@inertiajs/react"
import ShowSaleReminder from "./ShowSalesReminder"
import Header from "../../Components/DashboardComponents/Header"
import Navigation from "../../Components/DashboardComponents/Navigation"
import Body from "../../Components/DashboardComponents/Body"

export default function Dashboard() {
    // Extracting props from the page using Inertia's usePage hook
    const {
        user,
        categories,
        products,
        reviewedProducts,
        productsRating,
        showSalesPopup,
    } = usePage().props

    // State to manage filtered products and search status
    const [filteredProducts, setFilteredProducts] = useState(products)
    const [isSearching, setIsSearching] = useState(false)

    // Update filtered products when products prop changes
    useEffect(() => {
        setFilteredProducts(products)
    }, [products])


    // Function to handle product search logic
    function handleSearchProduct(searchTerm) {

        if (!searchTerm || searchTerm.trim() === '') {
            setFilteredProducts(products)
            setIsSearching(false)
        } else {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
            )
            setFilteredProducts(filtered)
            setIsSearching(true)
        }
    }

    return (
        <>

            {/* Rendering the dashboard components */}
            <Header user={user} searchProduct={handleSearchProduct}/>
            {/* Navigation component with filtered products passed as props */}
            <Navigation reviewedProducts={reviewedProducts} />
            {/* Body component with user, categories, and filtered products passed as props */}

            <ShowSaleReminder showSalesPopup={showSalesPopup}/>

            <Body
                user={user}
                categories={categories}
                products={filteredProducts}
                searchProduct={handleSearchProduct}
                isSearching={isSearching}
                productsRating={productsRating}
            />
        </>
    )
}
