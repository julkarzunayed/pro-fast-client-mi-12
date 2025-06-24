import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

import bannerImage1 from '../../../assets/banner/banner1.png'
import bannerImage2 from '../../../assets/banner/banner2.png'
import bannerImage3 from '../../../assets/banner/banner3.png'


const Banner = () => {
    return (
        <Carousel
            className='my-1'
            autoPlay={true}
            infiniteLoop={true}
            showStatus={false}
            showThumbs={false}
            
        >
            <div>
                <img src={bannerImage1} />
                <p className="legend">Legend 1</p>
            </div>
            <div>
                <img src={bannerImage2} />
                <p className="legend">Legend 2</p>
            </div>
            <div>
                <img src={bannerImage3} />
                <p className="legend">Legend 3</p>
            </div>
        </Carousel>
    );
};

export default Banner;