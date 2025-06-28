import React from "react";
import HowItWorksCard from "./HowItWorksCard";


// HowItWorks Component
const HowItWorks = () => {
  // Data for the 4 cards in the "How it Works" section
  const workSteps = [
    {
      id: 1,
      title: "Booking Pick & Drop",
      description: "From personal packages to business shipments — we deliver on time, every time.",
      icon: "https://placehold.co/64x64/E0F2F1/004D40?text=🚚", // Demo truck icon
    },
    {
      id: 2,
      title: "Cash On Delivery",
      description: "From personal packages to business shipments — we deliver on time, every time.",
      icon: "https://placehold.co/64x64/E0F2F1/004D40?text=💸", // Demo cash icon
    },
    {
      id: 3,
      title: "Delivery Hub",
      description: "From personal packages to business shipments — we deliver on time, every time.",
      icon: "https://placehold.co/64x64/E0F2F1/004D40?text=📦", // Demo hub icon
    },
    {
      id: 4,
      title: "Booking SME & Corporate",
      description: "From personal packages to business shipments — we deliver on time, every time.",
      icon: "https://placehold.co/64x64/E0F2F1/004D40?text=🏢", // Demo corporate icon
    },
  ];

  return (
    <section className=" max-w-6xl mx-auto py-16 px-4 font-sans">
      {/* Removed 'text-center' from this div to align heading left */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-secondary-content leading-tight mb-4 text-left"> {/* Added text-left */}
          How it Works
        </h2>
      </div>

      {/* This div centers the grid of cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {workSteps.map((step) => (
          <HowItWorksCard
            key={step.id}
            title={step.title}
            description={step.description}
            icon={step.icon}
          />
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
