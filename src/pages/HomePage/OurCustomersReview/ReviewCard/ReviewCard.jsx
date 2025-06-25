import React from "react";

const ReviewCard = ({ comment, customerName, company, customerImage }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Top Section */}
      <div className="flex justify-center mb-4">
        <img src="/assets/double-quote.png" alt="Quote" className="w-8 h-8" />
      </div>
      {/* Comment */}
      <p className="text-gray-600 mb-4">{comment}</p>
      {/* Horizontal Line */}
      <div className="border-t border-dashed mb-4"></div>
      {/* Customer Details */}
      <div className="flex items-center gap-4">
        <img
          src={`/assets/${customerImage}`}
          alt={customerName}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h4 className="font-bold text-lg">{customerName}</h4>
          <p className="text-gray-500 text-sm">{company}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
