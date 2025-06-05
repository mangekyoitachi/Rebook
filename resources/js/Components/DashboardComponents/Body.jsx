import React, { useState, useEffect } from "react"
import Slider from "./Slider"
import Category from "./Category"
import Product from "./Product"

function Body({user, categories, products, searchProduct, isSearching, productsRating }) {
    // State to manage the selected category
    const [selectedCategory, setSelectedCategory] = useState(null)

    // Function to handle category selection
    const handleCategoryClick = (category) => {
        setSelectedCategory(category)
    }

    // Reset category selection when search becomes active
    useEffect(() => {
        if (isSearching) {
            setSelectedCategory(null)
        }
    }, [isSearching])

    // Determine what to show based on search state and category selection
    let showSliderAndCategories = true
    let productTitle = "Discover"
    let productList = products || []

    if (isSearching) {
        // When searching, hide slider and categories, show search results
        showSliderAndCategories = false
        productTitle = products.length === 1 ? `Search Result (${products.length} item)` : `Search Results (${products.length} items)`
        productList = products || []
    } else if (selectedCategory) {
        // When category is selected, hide slider and categories, show category products
        showSliderAndCategories = false
        productTitle = selectedCategory.name
        productList = selectedCategory.products || []
    }

    return (
        <div className="mx-[10%]">
            {/* Conditional rendering of the slider and category components */}
            {showSliderAndCategories && (
                <>
                    <Slider />
                    <Category
                        // Function to handle category selection
                        onSendData={handleCategoryClick}
                        categories={categories}
                        products={products}
                    />
                </>
            )}

            <Product
                // Title for the product section
                title={productTitle}
                products={productList}
                productsRating={productsRating}
            />
        </div>
    )
}

export default Body
