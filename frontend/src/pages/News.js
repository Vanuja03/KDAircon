import React, { useEffect } from 'react';
import ti from '../images2/Condenser1.jpg';
import '../styles/news.css';
import 'swiper/swiper-bundle.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import img1 from '../images2/kalutara.jpg';
import img2 from '../images2/ac1.jpg';
import img3 from '../images2/payy.jpg';
import img4 from '../images2/acdel.jpg';
import Aos from 'aos';
import 'aos/dist/aos.css';
import '../styles/topics.css';

const News = () => {

    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, []);
    return (
        <div className='container' data-aos="fade-up">
            <h1 className='topic'>News</h1>
            <Swiper
                spaceBetween={50}
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                speed={1000}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
                className='swip'
            >
                <SwiperSlide><div className='swiper-container'>
                    <img src={img1} className='imges' />
                    <div className='overlay'>
                        <h3 data-aos="fade-right">Estimated new workspace</h3>
                        <p data-aos="fade-left">On expanding our group we estimated a new factory outlet open in Kalutara in 2025</p>
                    </div>
                </div></SwiperSlide>
                <SwiperSlide><div className='swiper-container'>
                    <img src={img2} className='imges' />
                    <div className='overlay'>
                        <h3 >1st Time in Sri Lanka</h3>
                        <p>It is time to unveil the new Indoor unit that exclusively manufacturing in Sri Lanka For the 1st time</p>
                    </div>
                </div></SwiperSlide>
                <SwiperSlide><div className='swiper-container'>
                    <img src={img3} className='imges' />
                    <div className='overlay'>
                        <h3>Online Payment system Coming soon !!</h3>
                        <p>Get ready to pay your bills online through new payment gateway that are more encrypted and secure</p>
                    </div>
                </div></SwiperSlide>
                <SwiperSlide><div className='swiper-container'>
                    <img src={img4} className='imges' />
                    <div className='overlay'>
                        <h3>Delivery service Coming soon !!</h3>
                        <p>Get ready to experience with delivery system which collaborates with transport and currior services such as PickMe </p>
                    </div>
                </div></SwiperSlide>

            </Swiper>
        </div>
    );
};

export default News;
