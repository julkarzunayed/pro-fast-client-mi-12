import React from "react";

const ServicesCard = ({ service }) => {
  const { icon, title, description } = service
  return (
    <div
      className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center hover:bg-[#CAEB66]">
      <div className="text-4xl text-secondary mb-4">{icon}</div>
      <h3 className="text-xl text-secondary font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ServicesCard;
