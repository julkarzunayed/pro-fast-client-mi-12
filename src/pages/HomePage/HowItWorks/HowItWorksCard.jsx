import React from 'react';
import bookingIcon from '../../../assets/bookingIcon.png'
// HowItWorksCard Component
const HowItWorksCard = ({ title, description, icon }) => {
  return (
    // Removed 'text-center' from this div to align text left
    <div className="bg-white rounded-2xl shadow-lg p-6  transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
      {/* Icon/Image Placeholder */}
      <div className="mb-4 text-green-600">
        {/* Using a simple placeholder image or an SVG/Icon if you have one */}
        <img
          src={bookingIcon}
          alt={title}
          className="w-16 h-16"
          onError={(e) => {
            e.target.onerror = null; // Prevents infinite loop
            // Fallback to a placeholder if the icon URL doesn't work
            e.target.src = `https://placehold.co/64x64/E0F2F1/004D40?text=ICON`;
          }}
        />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2  w-full">{title}</h3> {/* Added text-left and w-full */}
      <p className="text-gray-600 text-base w-full">{description}</p> {/* Added text-left and w-full */}
    </div>
  );
};
export default HowItWorksCard;