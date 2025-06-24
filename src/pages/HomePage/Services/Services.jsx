import React from "react";

import { FaTruck, FaWarehouse, FaMoneyBillWave, FaBuilding, FaExchangeAlt, FaMapMarkedAlt } from "react-icons/fa";
import ServicesCard from "./ServicesCard/ServicesCard";

const servicesData = [
  {
    icon: <FaTruck />,
    title: "Express & Standard Delivery",
    description: "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off."
  },
  {
    icon: <FaMapMarkedAlt />,
    title: "Nationwide Delivery",
    description: "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours."
  },
  {
    icon: <FaWarehouse />,
    title: "Fulfillment Solution",
    description: "We also offer customized service with inventory management support, online order processing, packaging, and after-sales support."
  },
  {
    icon: <FaMoneyBillWave />,
    title: "Cash on Home Delivery",
    description: "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product."
  },
  {
    icon: <FaBuilding />,
    title: "Corporate Service / Contract In Logistics",
    description: "Customized corporate services which includes warehouse and inventory management support."
  },
  {
    icon: <FaExchangeAlt />,
    title: "Parcel Return",
    description: "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants."
  }
];

const Services = () => {
  return (
    <div className="bg-base-300 py-12 my-6 rounded-2xl px-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4">Our Services</h2>
        <p className="max-w-4xl mx-auto text-gray-600">Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesData.map((service, index) => (
          <ServicesCard
            key={index}
            service={service}
          />
        ))}
      </div>
    </div>
  );
};

export default Services;
