import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout';
import backq from '../images2/hm1.mp4';
import '../styles/home.css'
import Feedbacks from './Feedbacks';
import { Button, Card, Container } from 'react-bootstrap';
import gov from '../images2/gov.png';
import delivery from '../images2/delivery.png';
import service from '../images2/service.png';
import warranty from '../images2/warant.png';
import Aos from 'aos';
import 'aos/dist/aos.css';
import News from './News';
import '../styles/topics.css';
import { useNavigate } from 'react-router-dom';



const Home = () => {

  const [greet, setGreet] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    Aos.init({ duration: 1000 });

    const currentHour = new Date().getHours();

    if (currentHour >= 0 && currentHour < 12) {
      setGreet('Morning');
    } else if (currentHour >= 12 && currentHour < 15) {
      setGreet('Afternoon');
    } else if (currentHour >= 15 && currentHour < 19) {
      setGreet('Evening');
    } else {
      setGreet('Night');
    }
  }, []);

  const navigate = useNavigate();

  return (
    <div>
      <Layout>
        <div className='hmmain'>
          <div className='homecontainer1' data-aos="fade-up">
            <div className='homediv11'>
              <h1>Good {greet}!!</h1>
              <p className='homep'>Explore the new invention of Sri Lanka for the 1st time</p>
              <Button onClick={() => navigate('/addtocart')} data-aos="fade-up" className='homecontbutton'>Visit now</Button>
            </div>
            <video className='videoss' autoPlay loop muted disablePictureInPicture>
              <source src={backq} type="video/mp4" />
            </video>
          </div>
          <div className='homecontainer2' data-aos="fade-up">
            <div className='ct1'>
              <div className='content' data-aos="fade-right">
                <img className='img1fx' src={service} />
                <p>Instant Service</p>
              </div>
              <div className='content' data-aos="fade-up">
                <img className='img2fx' src={delivery} />
                <p>Fast Delivery</p>
              </div>
            </div>
            <div className='ct2'>
              <div className='content' data-aos="fade-up">
                <img className='img3fx' src={gov} />
                <p>Government Approved</p>
              </div>
              <div className='content' data-aos="fade-left">
                <img className='img4fx' src={warranty} />
                <p>Warranties Included</p>
              </div>
            </div>
          </div>
          <News />


          <Feedbacks />
        </div>
      </Layout>
    </div>
  )
}

export default Home;
