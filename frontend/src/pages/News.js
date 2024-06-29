import React from 'react';
import ti from '../images2/Condenser1.jpg';
import '../styles/news.css';

const News = () => {
    return (
        <div className='container'>
            <div className='slider'>
                <div className='slides auto-slideshow'>
                    <div className='slide'>
                        <img src={ti} alt='Slide 1' />
                        <div className='caption'>
                            <p>Test1sssssssssssssssssssssssssssss</p>
                        </div>
                    </div>
                    <div className='slide'>
                        <img src={ti} alt='Slide 2' />
                        <div className='caption'>
                            <p>test2222222222222h2222222222222222h2222222</p>
                        </div>
                    </div>
                    <div className='slide'>
                        <img src={ti} alt='Slide 3' />
                        <div className='caption'>
                            <p>test3sssssssssshhhhhhhhhhhhhhssssssssssssssnnnnnnnnn</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default News;
