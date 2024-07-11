import React, { useEffect } from 'react';
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import img1 from '../images2/trs1ac.jpg';
import img2 from '../images2/trscnd.jpeg';
import img3 from '../images2/trcondenser.jpg';
import img4 from '../images2/trnscomp.jpg';
import Aos from 'aos';
import 'aos/dist/aos.css';

const Transition = () => {

    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, []);
    return (
        <div className='container' data-aos="fade-up">

            <Swiper
                spaceBetween={50}
                modules={[A11y, Autoplay]}
                slidesPerView={1}
                autoplay={{ delay: 5000 }}
                speed={1000}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
                className='swip'
            >
                <SwiperSlide><div className='swiper-containers'>
                    <img src={img1} className='timges' />
                </div></SwiperSlide>
                <SwiperSlide><div className='swiper-containers'>
                    <img src={img2} className='timges' />
                </div></SwiperSlide>
                <SwiperSlide><div className='swiper-containers'>
                    <img src={img3} className='timges' />
                </div></SwiperSlide>
                <SwiperSlide><div className='swiper-containers'>
                    <img src={img4} className='timges' />
                </div></SwiperSlide>

            </Swiper>
        </div>
    );
};

export default Transition;
