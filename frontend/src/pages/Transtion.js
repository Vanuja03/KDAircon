import React from 'react'
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import 'swiper/css';
import i1 from '../images2/indr.jpg';
import i2 from '../images2/outdor.jpg';
import i3 from '../images2/cndnsr.jpg';
import i4 from '../images2/comprs.jpg';
import '../styles/transition.css';


const Transtion = () => {
    return (
        <div>
            <Swiper
                spaceBetween={50}
                modules={[Navigation, A11y, Autoplay]}
                slidesPerView={1}
                autoplay={{ delay: 5000 }}
                speed={1000}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
            >
                <SwiperSlide className='cont2'><img src={i1} className='transimg' /></SwiperSlide>
                <SwiperSlide className='cont2'><img src={i2} className='transimg' /></SwiperSlide>
                <SwiperSlide className='cont2'><img src={i3} className='transimg' /></SwiperSlide>
                <SwiperSlide className='cont2'><img src={i4} className='transimg' /></SwiperSlide>
            </Swiper>
        </div>
    )
}

export default Transtion
