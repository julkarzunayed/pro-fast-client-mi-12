import React from 'react';
import Banner from '../Banner/Banner';
import Services from '../Services/Services';
import BrandsLogosCarousel from '../BrandsLogosCarousel/BrandsLogosCarousel';
import HorizontalCardsSection from '../HorizontalCardsSection/HorizontalCardsSection';
import BecomeMerchant from '../BecomeMerchant/BecomeMerchant';
import OurCustomersReview from '../OurCustomersReview/OurCustomersReview';
import HowItWorks from '../HowItWorks/HowItworks';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <HowItWorks></HowItWorks>
            <Services
            // data-aos="fade-up"
            />
            <BrandsLogosCarousel/>

            <hr className='border-t border-dashed border-gray-400'/>
            <HorizontalCardsSection></HorizontalCardsSection>
            <hr className='border-t border-dashed border-gray-400'/>

            <BecomeMerchant/>

            <OurCustomersReview/>
        </div>
    );
};

export default Home;