import React, { Link, useState } from "react"

import bag from "../../../../public/Assets/Dashboard/Category/bag.png"
import notebook from "../../../../public/Assets/Dashboard/Category/notebook.webp"
import pen from "../../../../public/Assets/Dashboard/Category/pen.png"
import desktop from "../../../../public/Assets/Dashboard/Category/desktop.png"
import health from "../../../../public/Assets/Dashboard/Category/health.png"
import gadget from "../../../../public/Assets/Dashboard/Category/gadget.png"

function Category({ onSendData, categories, products }) {
    const [selectedProducts, setSelectedProducts] = useState(products)
    const [productTitle, setProductTitle] = useState()

    function selectCategory(categoryName) {
        const matchedCategory = categories.find(
            c => c.name.toLowerCase() === categoryName.toLowerCase()
        )
        if (!matchedCategory) return

        const filteredProducts = products.filter(
            p => p.category_id === matchedCategory.id
        )

        setProductTitle(matchedCategory.name)
        setSelectedProducts(filteredProducts)

        onSendData({
            name: matchedCategory.name,
            products: filteredProducts
        })
    }

    return (
        <>
            <h2 className="mt-20 text-4xl font-bold text-[#5a1c1c] border-b border-gray-300 pb-4 uppercase text-center shadow-md rounded-xl">
                Categories
            </h2>
            <div className="overflow-x-auto hide-scrollbar mt-6">
                <div className="flex flex-nowrap gap-8 px-4 justify-center">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => selectCategory(category.name)}
                            className="flex flex-col items-center w-52 flex-shrink-0"
                        >
                            <div className="rounded-full shadow-lg p-8 bg-white">

                                {categories.image_url ? (
                                    <img
                                        src={category.image_url}
                                        alt={category.name}
                                        className="w-30 h-30 object-contain"
                                    />
                                ) : (
                                    <div className="w-30 h-30 flex items-center justify-center rounded-full shadow-md bg-gray-100 text-gray-500">
                                        No image preview
                                    </div>
                                )}
                            </div>
                            <p className="mt-2 text-xl text-[#5a1c1c] text-center">{category.name}</p>
                        </button>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Category
