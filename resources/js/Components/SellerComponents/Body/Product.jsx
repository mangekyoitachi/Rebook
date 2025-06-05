import React, { useState, useRef, useEffect } from "react"
import { Link, useForm, router } from "@inertiajs/react"

function Product({
    component,
    onChangeComponent,
    user,
    seller_id,
    shop,
    categories,
    orderItems,
    products: initialProducts,
}) {
    const [open, setOpen] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [products, setProducts] = useState(initialProducts || [])
    const [editingProductId, setEditingProductId] = useState(null)
    const [editImagePreview, setEditImagePreview] = useState(null)
    const deleteForm = useForm({ _method: 'delete' })

    const dropdownRef = useRef()

    // Initialize useForm for adding a new product
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        price: 0,
        description: "",
        category_id: "",
        stock: 0,
        image: null
    })

    // Initialize useForm for editing an existing product
    const editForm = useForm({
        id: null,
        name: "",
        price: null,
        stock: null,
        description: "",
        category_id: "",
        image: null,
        _method: 'put'
    })

    const handleEditClick = (product) => {
        setEditingProductId(product.id)
        setEditImagePreview(product.image_url) // Set current product image as preview
        editForm.setData({
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            description: product.description || "",
            category_id: product.category_id || "",
            image: null,
            _method: 'put'
        })
        setShowEditModal(true)
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleAddProduct = (e) => {
        e.preventDefault()

        post('/shop/create-product', {
            onSuccess: (page) => {
                console.log("Add response:", page)
                if (page.props && page.props.flash && page.props.flash.newProduct) {
                    const newProduct = page.props.flash.newProduct
                    setProducts(prevProducts => [...prevProducts, newProduct])
                } else {
                    const tempProduct = {
                        id: Date.now(),
                        name: data.name,
                        price: data.price,
                        stock: data.stock || 0,
                        description: data.description,
                        category_id: data.category_id,
                        image_url: data.image instanceof File ? URL.createObjectURL(data.image) : null
                    }
                    setProducts(prevProducts => [...prevProducts, tempProduct])
                    setTimeout(() => {
                        router.reload({ only: ['products'] })
                    }, 300)
                }
                setShowAddModal(false)
                reset()
            },
            onError: (errors) => {
                console.error("Validation errors:", errors)
            }
        })
    }

    const handleSaveEdit = (e) => {
        e.preventDefault()

        editForm.post(`/shop/${editingProductId}/edit-product`, {
            onSuccess: (page) => {
                console.log("Edit response:", page)
                if (page.props && page.props.flash && page.props.flash.updatedProduct) {
                    const updatedProduct = page.props.flash.updatedProduct
                    setProducts(prevProducts =>
                        prevProducts.map(product =>
                            product.id === editingProductId ? updatedProduct : product
                        )
                    )
                } else {
                    const tempUpdatedProduct = {
                        ...editForm.data,
                        id: editingProductId,
                        image_url: editForm.data.image instanceof File
                            ? URL.createObjectURL(editForm.data.image)
                            : products.find(p => p.id === editingProductId)?.image_url
                    }
                    setProducts(prevProducts =>
                        prevProducts.map(product =>
                            product.id === editingProductId ? tempUpdatedProduct : product
                        )
                    )
                    setTimeout(() => {
                        router.reload({ only: ['products'] })
                    }, 300)
                }
                setShowEditModal(false)
                setEditingProductId(null)
                setEditImagePreview(null)
            },
            onError: (errors) => {
                console.error("Edit operation failed:", errors)
            }
        })
    }

    const handleDeleteProduct = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            deleteForm.post(`/shop/${id}/delete-product`, {
                onSuccess: (page) => {
                    console.log("Delete response:", page)
                    setProducts(products.filter(p => p.id !== id))
                },
                onError: (errors) => {
                    console.error("Delete operation failed:", errors)
                }
            })
        }
    }

    const handleEditImageChange = (e) => {
        const file = e.target.files[0]
        editForm.setData('image', file)

        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setEditImagePreview(e.target.result)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <div className="bg-white mt-20">
            {/* Product Section */}
            <div className="bg-white rounded-xl shadow-md mx-[10%] p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">My Products</h1>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md flex items-center"
                    >
                        <span className="mr-1">+</span> Add new Product
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="grid grid-cols-4 gap-4 px-6 py-4 font-semibold border-b border-gray-200">
                        <div>Product(s)</div>
                        <div>Price</div>
                        <div>Stock(s)</div>
                        <div>Action</div>
                    </div>

                    {products.length > 0 ? (
                        products.map(product => (
                            <div key={product.id} className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-gray-200 bg-white shadow-md items-center">
                                <div className="flex items-center ">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-24 h-24 mr-4 rounded-md shadow-md object-cover"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 mr-4 rounded-md shadow-md bg-gray-100 flex items-center justify-center text-gray-500 text-xs">
                                            No Image
                                        </div>
                                    )}
                                    <span className="text-sm">{product.name}</span>
                                </div>
                                <div>₱{product.price}</div>
                                <div>{product.stock}</div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEditClick(product)}
                                        className="bg-red-700 text-white px-3 py-1 rounded-md shadow-md text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md shadow-md text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-6 py-4 text-center text-gray-500">
                            No products available. Add your first product!
                        </div>
                    )}
                </div>
            </div>

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md mx-[25%] w-full overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Add New Product</h2>
                        <form onSubmit={handleAddProduct}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Product Name</label>
                                <input
                                    type="text"
                                    className={`w-full p-4 bg-white shadow-md rounded-xl ${errors.name ? 'border-red-500' : ''}`}
                                    value={data.name}
                                    placeholder="Enter product name"
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Price (₱)</label>
                                <input
                                    type="number"
                                    className={`w-full p-4 bg-white shadow-md rounded-xl ${errors.price ? 'border-red-500' : ''}`}
                                    value={data.price}
                                    onChange={(e) => setData('price', Number(e.target.value))}
                                />
                                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Stock</label>
                                <input
                                    type="number"
                                    className={`w-full p-4 bg-white shadow-md rounded-xl ${errors.stock ? 'border-red-500' : ''}`}
                                    value={data.stock}
                                    onChange={(e) => setData('stock', Number(e.target.value))}
                                />
                                {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    className={`w-full p-2 bg-white shadow-md rounded-xl ${errors.description ? 'border-red-500' : ''}`}
                                    rows="3"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <select
                                    className={`w-full p-4 bg-white shadow-md rounded-xl ${errors.category_id ? 'border-red-500' : ''}`}
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                >
                                    <option value="">Select category</option>
                                    {categories && categories.length > 0 ? (
                                        categories.map(category => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))
                                    ) : (
                                        <>
                                            <p className="text-center">No Category existing</p>
                                        </>
                                    )}
                                </select>
                                {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Import Image</label>
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    className={`w-full p-4 bg-white shadow-md rounded-xl ${errors.image ? 'border-red-500' : ''}`}
                                    onChange={(e) => setData('image', e.target.files[0])}
                                />
                                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                            </div>
                            <div className="flex justify-end space-x-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false)
                                        reset()
                                    }}
                                    className="px-4 py-2 border rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-red-700 text-white px-4 py-2 rounded-md disabled:opacity-75"
                                >
                                    {processing ? 'Adding...' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

           {/* Edit Product Modal */}
{showEditModal && (
   <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-6xl max-h-screen overflow-y-auto">
      <div className="p-6 pt-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Edit Product</h1>
        </div>
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Product Image</label>
            <div className="bg-white shadow-md rounded-xl p-1 h-48 flex items-center justify-center">
              {editImagePreview ? (
                <img
                  src={editImagePreview}
                  alt="Product Preview"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-gray-500 text-center">
                  <p>No image selected</p>
                  <p className="text-sm">Choose an image to preview</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*,video/*"
              className={`mt-2 w-full p-4 bg-white shadow-md rounded-xl ${editForm.errors.image ? 'border-red-500' : ''}`}
              onChange={handleEditImageChange}
            />
            {editForm.errors.image && <p className="text-red-500 text-xs mt-1">{editForm.errors.image}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm">Product Title</label>
            <input
              type="text"
              className={`w-full p-4 bg-white shadow-md rounded-xl ${editForm.errors.name ? 'border-red-500' : ''}`}
              value={editForm.data.name}
              onChange={(e) => editForm.setData('name', e.target.value)}
            />
            {editForm.errors.name && <p className="text-red-500 text-xs mt-1">{editForm.errors.name}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm">Product Price</label>
            <input
              type="number"
              className={`w-full p-4 bg-white shadow-md rounded-xl ${editForm.errors.price ? 'border-red-500' : ''}`}
              value={editForm.data.price}
              onChange={(e) => editForm.setData('price', Number(e.target.value))}
            />
            {editForm.errors.price && <p className="text-red-500 text-xs mt-1">{editForm.errors.price}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm">Product Stock</label>
            <input
              type="number"
              className={`w-full p-4 bg-white shadow-md rounded-xl ${editForm.errors.stock ? 'border-red-500' : ''}`}
              value={editForm.data.stock}
              onChange={(e) => editForm.setData('stock', Number(e.target.value))}
            />
            {editForm.errors.stock && <p className="text-red-500 text-xs mt-1">{editForm.errors.stock}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm">Product Description</label>
            <textarea
              className={`w-full p-4 bg-white shadow-md rounded-xl ${editForm.errors.description ? 'border-red-500' : ''}`}
              rows="3"
              value={editForm.data.description}
              onChange={(e) => editForm.setData('description', e.target.value)}
            />
            {editForm.errors.description && <p className="text-red-500 text-xs mt-1">{editForm.errors.description}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm">Product Category</label>
            <select
              className={`w-full p-4 bg-white shadow-md rounded-xl ${editForm.errors.category_id ? 'border-red-500' : ''}`}
              value={editForm.data.category_id}
              onChange={(e) => editForm.setData('category_id', e.target.value)}
            >
              <option value="">Select category</option>
              {categories && categories.length > 0 ? (
                categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))
              ) : (
                <>
                  <option value="1">Stationary</option>
                  <option value="2">Bags</option>
                  <option value="3">Writing Tools</option>
                  <option value="4">Desk Supplies</option>
                  <option value="5">Health and Safety</option>
                  <option value="6">Technology and Gadgets</option>
                </>
              )}
            </select>
            {editForm.errors.category_id && <p className="text-red-500 text-xs mt-1">{editForm.errors.category_id}</p>}
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowEditModal(false)
                setEditImagePreview(null)
              }}
              className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-md"
            >
              Cancel Edit
            </button>
            <button
              type="submit"
              disabled={editForm.processing}
              className="bg-red-700 text-white px-4 py-2 rounded-md"
            >
              {editForm.processing ? 'Saving...' : 'Save Edit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

        </div>
    )
}

export default Product
