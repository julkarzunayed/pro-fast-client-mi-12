import React from 'react';
import HorizontalCard from './HorizontalCard/HorizontalCard';
import image1 from '../../../assets/illustration/Illustration.png'
import image2 from '../../../assets/illustration/Vector.png'
import image3 from '../../../assets/illustration/Group 4.png'

const HorizontalCardsSection = () => {
    const cardsData = [
        {
            id: 1,
            title: "Live Parcel Tracking",
            description:
                "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
            image: image1
        },
        {
            id: 2,
            title: "100% Safe Delivery",
            description:
                "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
            image: image2
        },
        {
            id: 3,
            title: "24/7 Call Center Support",
            description:
                "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
            image: image1
        }
    ];

    return (
        <div
            data-aos="fade-left"
            className="p-8 mx-10">
            {/* <h2 className="text-3xl font-bold text-secondary-content text-center mb-6">Our Features</h2> */}
            <div className="space-y">
                {cardsData.map((card, index) => (
                    <HorizontalCard
                        key={index}
                        card={card}
                    />
                ))}
            </div>
        </div>
    );
};

export default HorizontalCardsSection;
