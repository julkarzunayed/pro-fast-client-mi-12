import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper";
import ReviewCard from "./ReviewCard/ReviewCard";

const reviews = [
  {
    id: 1,
    comment: "The service was fantastic! The delivery was on time, and the support team was very helpful.",
    customerName: "John Doe",
    company: "Doe Logistics",
    customerImage: "customer1.jpg"
  },
  // ... Add the other data points
];

const OurCustomersReview = () => {
  return (
    <section className="py-10 bg-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">We've helped thousands of sales teams</h2>
      </div>
      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id}>
            <ReviewCard {...review} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default OurCustomersReview;
