import React, { useState, useRef, useEffect, use } from 'react';
import quotation from '../../../assets/reviewQuote.png'
// ReviewCard Component
const ReviewCard = ({ comment, customerName, company, customerImage, opacityClass, scaleClass, zIndexClass }) => {
    return (
        <div
            className={`bg-white rounded-lg shadow-lg p-6 m-4 flex-none transform transition-all duration-500 ease-in-out ${opacityClass} ${scaleClass} ${zIndexClass} flex flex-col justify-between`}
            style={{ minHeight: '250px' }} // Ensures all cards have a consistent minimum height
        >
            {/* Quotation */}
            <img className='w-8 mb-2' src={quotation} alt="" />
            <div className="flex-grow">
                <p className="text-gray-700 mb-4 italic">
                    {/* <span className="text-4xl text-green-500 font-extrabold mr-2">"</span> */}
                    {comment}
                </p>
            </div>
            {/* Dashed Line added here */}
            <div className="border-t-2 border-dashed border-gray-300 w-full mb-4"></div>
            <div className="flex items-center mt-4">
                {/* Placeholder for customer image - uses placehold.co for dynamic initial or fallback image */}
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-xl overflow-hidden flex-shrink-0">
                    {customerImage ? (
                        <img
                            src={`https://placehold.co/48x48/87CEEB/FFFFFF?text=${customerImage.charAt(0).toUpperCase()}`}
                            alt={customerName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null; // Prevents infinite loop on error
                                e.target.src = `https://placehold.co/48x48/87CEEB/FFFFFF?text=${customerName.charAt(0).toUpperCase()}`;
                            }}
                        />
                    ) : (
                        customerName.charAt(0).toUpperCase() // Fallback to first letter if no image prop
                    )}
                </div>
                <div className="ml-4">
                    <h3 className="font-semibold text-gray-800 text-base md:text-lg">{customerName}</h3>
                    <p className="text-sm text-gray-600">{company}</p>
                </div>
            </div>
        </div>
    );
};


// OurCustomerReview Component
const reviewDataResponse = fetch(`/data/customers_review.json`).then(res => res.json())
const OurCustomerReview = () => {
    // Fake JSON data for customer reviews
    const customerReviews = use(reviewDataResponse);
    const customerReviewsDisabled = [
        {
            id: 1,
            comment: "The service was fantastic! The delivery was on time, and the support team was very helpful.",
            customerName: "John Doe",
            company: "Doe Logistics",
            customerImage: "customer1.jpg",
        },
        {
            id: 2,
            comment: "Absolutely outstanding quality and professional service. Highly recommended!",
            customerName: "Jane Smith",
            company: "Smith Innovations",
            customerImage: "customer2.jpg",
        },
        {
            id: 3,
            comment: "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
            customerName: "Awlad Hossin",
            company: "Senior Product Designer",
            customerImage: "customer3.jpg",
        },
        {
            id: 4,
            comment: "Efficient and reliable. Our business operations have improved significantly thanks to their solutions.",
            customerName: "Michael Johnson",
            company: "Johnson Tech",
            customerImage: "customer4.jpg",
        },
        {
            id: 5,
            comment: "Excellent communication and timely execution. A pleasure to work with!",
            customerName: "Emily Davis",
            company: "Davis Enterprises",
            customerImage: "customer5.jpg",
        },
        {
            id: 6,
            comment: "Their expertise is unmatched. They truly understand our needs and deliver beyond expectations.",
            customerName: "David Wilson",
            company: "Wilson & Co.",
            customerImage: "customer6.jpg",
        },
        {
            id: 7,
            comment: "Very user-friendly products and exceptional customer support. Couldn't be happier!",
            customerName: "Sarah Brown",
            company: "Brown Digital",
            customerImage: "customer7.jpg",
        },
        {
            id: 8,
            comment: "They transformed our workflow! Seamless integration and noticeable improvements.",
            customerName: "Chris Miller",
            company: "Miller Solutions",
            customerImage: "customer8.jpg",
        },
        {
            id: 9,
            comment: "Top-notch service from start to finish. Highly professional and effective.",
            customerName: "Olivia Garcia",
            company: "Garcia Group",
            customerImage: "customer9.jpg",
        },
        {
            id: 10,
            comment: "Incredible value for money. Their services have boosted our productivity immensely.",
            customerName: "James Rodriguez",
            company: "Rodriguez Corp.",
            customerImage: "customer10.jpg",
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef(null);

    // Effect to scroll the active card into view when currentIndex changes
    useEffect(() => {
        if (carouselRef.current) {
            const activeCardElement = carouselRef.current.children[currentIndex];
            if (activeCardElement) {
                activeCardElement.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center', // Centers the element horizontally
                    block: 'nearest', // Ensures it's visible vertically
                });
            }
        }
    }, [currentIndex]); // Re-run effect when currentIndex changes

    // Handler to go to the next review
    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % customerReviews.length);
    };

    // Handler to go to the previous review
    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? customerReviews.length - 1 : prevIndex - 1
        );
    };

    // Handler to go to a specific review by index (for navigation dots)
    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="bg-gray-100 py-16 px-4 font-sans overflow-hidden">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-4">
                    What our customers are saying
                </h2>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                    Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment, reduce pain, and strengthen your body with ease!
                </p>
            </div>

            {/* Carousel Wrapper */}
            <div className="relative flex justify-center items-center w-full">
                {/* Carousel Container (the scrollable part) */}
                <div
                    ref={carouselRef}
                    // The `snap-x snap-mandatory` and `snap-center` on items ensure smooth, centered snapping
                    className="flex overflow-x-hidden scroll-smooth snap-x snap-mandatory py-4 px-4 sm:px-8 md:px-12 w-full max-w-sm sm:max-w-md md:max-w-6xl lg:max-w-full"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    {customerReviews.map((review, index) => {
                        const distance = Math.abs(index - currentIndex); // Distance from the active card
                        let opacityClass = '';
                        let scaleClass = '';
                        let zIndexClass = '';
                        let widthClass = '';

                        // Apply styling based on distance to mimic the image's visual effect
                        if (distance === 0) {
                            // Active card: full opacity, slightly larger, higher z-index
                            opacityClass = 'opacity-100';
                            scaleClass = 'scale-110';
                            zIndexClass = 'z-20';
                            widthClass = 'w-80 md:w-96'; // Larger width for the active card
                        } else if (distance === 1) {
                            // Immediate neighbors: reduced opacity to 50%
                            opacityClass = 'opacity-50'; // Changed from opacity-75
                            scaleClass = 'scale-100';
                            zIndexClass = 'z-10';
                            widthClass = 'w-80'; // Standard width for neighbors
                        } else if (distance === 2) {
                            // Cards two steps away: further reduced opacity to 20%
                            opacityClass = 'opacity-20'; // Changed from opacity-50
                            scaleClass = 'scale-95';
                            zIndexClass = 'z-0';
                            widthClass = 'w-72'; // Slightly smaller width
                        } else {
                            // Cards further than two steps away: very faded
                            opacityClass = 'opacity-10'; // Changed from opacity-20 for a more pronounced fade
                            scaleClass = 'scale-90';
                            zIndexClass = 'z-0';
                            widthClass = 'w-64'; // Even smaller width
                        }

                        return (
                            <div
                                key={review.id}
                                // `flex-shrink-0` prevents cards from shrinking to fit. `snap-center` for scroll-snap.
                                className={`flex-shrink-0 snap-center ${widthClass}`}
                            >
                                <ReviewCard
                                    {...review}
                                    opacityClass={opacityClass}
                                    scaleClass={scaleClass}
                                    zIndexClass={zIndexClass}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Navigation Dots and Arrows Section (combined) */}
            <div className="flex justify-center items-center mt-8 space-x-4"> {/* Increased space-x for separation */}
                {/* Previous Arrow Button */}
                <button
                    onClick={goToPrevious}
                    className="p-3 rounded-full shadow-lg hover:bg-gray-200 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    aria-label="Previous Review"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Navigation Dots */}
                <div className="flex space-x-2">
                    {customerReviews.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            // Active dot has green background, others are gray
                            className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentIndex ? 'bg-green-500' : 'bg-gray-400'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        ></button>
                    ))}
                </div>

                {/* Next Arrow Button */}
                <button
                    onClick={goToNext}
                    className="p-3 rounded-full shadow-lg hover:bg-gray-200 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    aria-label="Next Review"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default OurCustomerReview;