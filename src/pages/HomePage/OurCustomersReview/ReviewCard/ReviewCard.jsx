import React from "react";

const ReviewCard = ({ review, isActive }) => {
    return (
        <div
            className={`relative max-w-2xs bg-white rounded-lg shadow-lg p-6 text-center transition-all duration-300 ${isActive ? "opacity-100 scale-105" : "opacity-50 scale-95"
                }`}
        >
            {/* Quote Icon */}
            <img
                src={review.quoteImg}
                alt="quote"
                className="absolute top-4 left-4 w-6 h-6"
            />
            {/* Customer Comment */}
            <p className="text-gray-600 text-sm">{review.comment}</p>
            {/* Dashed Line */}
            <hr className="border-dashed border-gray-300 my-4" />
            {/* Customer Info */}
            <div className="flex items-center space-x-3">
                <img
                    src={`https://placehold.co/550x400/444444/ff7800.png?text=Avater`}
                    alt={review.name}
                    className="w-12 h-12 rounded-full"
                />
                <div className="text-left">
                    <h4 className="text-base text-secondary font-bold">{review.customerName}</h4>
                    <p className="text-sm text-gray-600">{review.company}</p>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;
