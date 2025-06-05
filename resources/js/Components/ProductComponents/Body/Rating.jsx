import { useState } from 'react'
import { useForm } from '@inertiajs/react'
import Comment from './Comment'

const StarIcon = ({ filled, size = 24, color = "#ccc", fillColor = "#FF5722" }) => (
    <span
        style={{
            fontSize: `${size}px`,
            color: filled ? fillColor : color,
            cursor: 'pointer',
            userSelect: 'none'
        }}
        aria-hidden="true"
    >
        ★
    </span>
)

const ReadOnlyStars = ({ rating }) => {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                    key={star}
                    size={16}
                    filled={rating >= star}
                    color="#ccc"
                    fillColor="#FF5722"
                />
            ))}
        </div>
    )
}

function Rating({ product, reviews, user }) {
    const [hoverRating, setHoverRating] = useState(0)
    const [editingReview, setEditingReview] = useState(null)
    const matchingReviews = reviews.filter((review) => review.product_id === product.id)

    // Sort reviews to show logged-in user's review first
    const sortedReviews = matchingReviews.sort((a, b) => {
        if (user && a.user_id === user.id) return -1
        if (user && b.user_id === user.id) return 1
        return 0
    })

    const { data, setData, post, processing, errors, reset } = useForm({
        rating: 0, // Initialize rating to 0 for new reviews
        comment: '',
    })

    // Form for editing reviews
    const editForm = useForm({
        rating: 0,
        comment: '',
    })

    // Form for deleting reviews
    const deleteForm = useForm({})

    const handleSubmit = (e) => {
            e.preventDefault()
            post(`/product/${product.id}/review`, {
                preserveScroll: true,
                onSuccess: () => {
                    reset('comment', 'rating');
                },
            })
        }

    const handleEditStart = (review) => {
        setEditingReview(review.id)
        editForm.setData({
            rating: review.rating,
            comment: review.comment,
        })
    }

    const handleEditSubmit = (e, reviewId) => {
        e.preventDefault()
        editForm.post(`/product/${reviewId}/review/edit`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingReview(null)
                editForm.reset()
            },
        })
    }

    const handleEditCancel = () => {
        setEditingReview(null)
        editForm.reset()
    }

    const handleDelete = (reviewId) => {
        if (confirm('Are you sure you want to delete this review?')) {
            deleteForm.delete(`/product/${reviewId}/review/delete`, {
                preserveScroll: true,
                onSuccess: () => {
                    // Review deleted successfully
                },
                onError: (errors) => {
                    console.error("Failed to delete review:", errors);
                }
            })
        }
    }

    return (
        <>
            {/* <Comment reviews={reviews} user={user} product={product}/> */}

            <div className="rounded-xl bg-white p-6 shadow-md my-8 ">
                <div>
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden my-8">
                            {sortedReviews.length > 0 ? (
                                sortedReviews.map((review) => (
                                    <div key={review.id} className="border-b border-gray-400 pb-4 last:border-b-0 m-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                {review.user && review.user.image ? (
                                                    <img
                                                        src={review.user.image}
                                                        alt={review.user.name}
                                                        className="h-10 w-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <svg
                                                        className="h-6 w-6 text-gray-400"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                        />
                                                    </svg>
                                                )}

                                                <span className="font-medium text-gray-800">
                                                    {review.user?.name || 'Anonymous'}
                                                </span>

                                                <ReadOnlyStars rating={review.rating} />
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </span>
                                        </div>

                                        {/* Edit form for the review */}
                                        {editingReview === review.id ? (
                                            <form onSubmit={(e) => handleEditSubmit(e, review.id)} className="mt-4 space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Rating <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => editForm.setData('rating', star)}
                                                                className="focus:outline-none"
                                                            >
                                                                <StarIcon
                                                                    size={20}
                                                                    filled={editForm.data.rating >= star}
                                                                    color="#ccc"
                                                                    fillColor="#FF5722"
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                    {editForm.errors.rating && (
                                                        <p className="text-red-500 text-xs mt-1">{editForm.errors.rating}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Comment
                                                    </label>
                                                    <textarea
                                                        rows={3}
                                                        value={editForm.data.comment}
                                                        onChange={(e) => editForm.setData('comment', e.target.value)}
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 px-3 py-2 border"
                                                        placeholder="Update your review..."
                                                    />
                                                    {editForm.errors.comment && (
                                                        <p className="text-red-500 text-xs mt-1">{editForm.errors.comment}</p>
                                                    )}
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        type="submit"
                                                        disabled={editForm.processing}
                                                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition duration-200 disabled:opacity-75"
                                                    >
                                                        {editForm.processing ? 'Updating...' : 'Update'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleEditCancel}
                                                        className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-md transition duration-200"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <>
                                                <p className="text-gray-700">{review.comment}</p>

                                                {user && user.id === review.user_id && (
                                                    <div className="mt-2 flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEditStart(review)}
                                                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(review.id)}
                                                            disabled={deleteForm.processing}
                                                            className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-75"
                                                        >
                                                            {deleteForm.processing ? 'Deleting...' : 'Delete'}
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="w-full text-center py-8">
                                    <p className="text-gray-500">No reviews for this product yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <h3 className="text-lg font-medium mb-4">
                    {reviews ? 'Write a Review' : 'Edit Your Review'}
                </h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating <span className="text-red-500">*</span>
                        </label>

                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setData('rating', star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="focus:outline-none"
                                >
                                    <StarIcon
                                        size={24}
                                        filled={(hoverRating || data.rating) >= star}
                                        color="#ccc"
                                        fillColor="#FF5722"
                                    />
                                </button>
                            ))}
                        </div>

                        {errors.rating && (
                            <p className="text-red-500 text-xs mt-1">{errors.rating}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="comment"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Your Review
                        </label>

                        <textarea
                            id="comment"
                            rows={4}
                            value={data.comment}
                            onChange={(e) => setData('comment', e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 px-3 py-2 border"
                            placeholder="Share your experience with this product..."
                        />

                        {errors.comment && (
                            <p className="text-red-500 text-xs mt-1">{errors.comment}</p>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition duration-200 disabled:opacity-75"
                        >
                            {processing ? 'Submitting...' : reviews ? 'Send Review' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Rating
