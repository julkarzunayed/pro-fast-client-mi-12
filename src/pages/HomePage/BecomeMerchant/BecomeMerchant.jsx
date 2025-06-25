import React from 'react';
import location from '../../../assets/location-merchant.png'

const BecomeMerchant = () => {
    return (
        <div 
        data-aos="fade-left"
        className="bg-[url(assets/be-a-merchant-bg.png)] bg-no-repeat p-20 bg-[#03373D] my-20 rounded-4xl">
            <div className="hero-content flex-col gap-14 lg:gap-0.5 lg:flex-row-reverse">
                <img
                    src={location}
                    className="max-w-md -ml-10 rounded-lg"
                />
                <div>
                    <h1 className="text-4xl text-white font-bold">
                        Merchant and Customer Satisfaction is Our First Priority
                    </h1>
                    <p className="py-6 text-gray-400">
                        We offer the lowest delivery charge with the highest value along with 100% safety of your product. Pathao courier delivers your parcels in every corner of Bangladesh right on time.
                    </p>
                    <button className="btn btn-primary rounded-full text-black">
                        Become a Merchant
                    </button>
                    <button className="btn btn-primary rounded-full btn-outline ms-4">
                        Become a Merchant
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BecomeMerchant;