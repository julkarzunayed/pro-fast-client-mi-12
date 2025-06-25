import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";
import Marquee from "react-fast-marquee";

import image1 from "../../../assets/brands/amazon.png"
import image2 from "../../../assets/brands/amazon_vector.png"
import image3 from "../../../assets/brands/casio.png"
import image4 from "../../../assets/brands/moonstar.png"
import image5 from "../../../assets/brands/randstad.png"
import image6 from "../../../assets/brands/start-people 1.png"
import image7 from "../../../assets/brands/start.png"

const BrandsLogosCarousel = () => {
    const logos = [
        image1,
        image2,
        image3,
        image4,
        image5,
        image6,
        image7,
    ];

    return (
        <div
            
            className="py-12 mx-10 ">
            <h2 className="text-3xl font-bold text-secondary-content text-center mb-8">We've helped thousands of sales teams</h2>
            <Marquee
                speed={60}
                gradient={false}
                pauseOnHover={true}
                className="overflow-hidden py-4 bg-gray-400 rounded-xl">
                {
                    logos.map((logo, index) => (
                        <div key={index} className="mx-20 my-2">
                            <img src={logo} alt={`Brand ${index + 1}`} className="h-6 object-contain" />
                        </div>
                    ))
                }
            </Marquee>
        </div>
    );
};

export default BrandsLogosCarousel;
