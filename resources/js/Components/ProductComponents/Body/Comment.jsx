import { useState } from "react";

export default function Comment({ reviews, user, product }) {

    // const userId = user.id
    // const sortedReviews = [...reviews].sort((a,b) => new Date(b.created_at) -new Date(a.created_at))

    // const userReview = sortedReviews.find(review => review.user_id === userId)
    // const latestReview = sortedReviews.find(review => review.user_id !== userId)
    // const remainingReviews = sortedReviews.filter(
    //     review => review !== userReview && review !== latestReview
    // )

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const renderStars = (rating) => {
    const ratingNum = Number(rating) || 0;
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-4 w-4 ${i < ratingNum ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
    );
  };


  return (
    <>
    <div className="bg-white rounded-xl shadow-md overflow-hidden my-8">
        {reviews.filter(review => review.product_id === product.id).length > 0 ? (
            reviews
            .filter(review => review.product_id === product.id)
            .map(review => (
                <div
                key={review.id}
                className="m-8 border-b flex flex-col border-gray-200 pb-6 last:border-0 last:pb-0"
                >
                <div className="flex justify-between">
                    <div className="mb-4">
                    <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
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
                        </div>

                        <div className="ml-3">
                        {renderStars(review.rating)}
                        <div className="flex flex-col xs:flex-row xs:items-center">
                            <p className="text-xs text-gray-500 mt-1">
                            {formatDate(review.created_at)}
                            </p>
                            {review.user && (
                            <p className="text-xs font-medium text-gray-700 xs:ml-2">
                                {review.user.name}
                            </p>
                            )}
                        </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="text-gray-800 leading-relaxed">
                        {review.comment}
                        </p>
                    </div>
                    </div>

                    {/* Uncomment this if editing/deleting is needed */}
                    {/* {user.id === review.user_id && (
                    <div className="flex items-center justify-end space-x-2">
                        <button
                        onClick={() => handleEditRequest()}
                        className="p-1 px-4 rounded-lg text-white font-bold bg-green-400"
                        >
                        Edit
                        </button>
                        <button
                        onClick={() => handleDeleteRequest()}
                        className="p-1 px-4 rounded-lg text-white font-bold bg-red-400"
                        >
                        Delete
                        </button>
                    </div>
                    )} */}
                </div>
                </div>
            ))
        ) : (
            <div className="w-full text-center py-8">
            <p className="text-gray-500">No reviews for this product yet.</p>
            </div>
        )}
        </div>
    </>
  );
}

