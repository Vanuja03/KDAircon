import React, { useEffect } from 'react'
import Layout from '../components/Layout';
import backq from '../images2/backtest.mp4';
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


const Home = () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);


  return (
    <div>
      <Layout>
        <div className='homecontainer1' data-aos="fade-up">
          <div className='homediv11'>
            <h1>Be cool at your own place</h1>
            <p className='homep'>Explore the new invention of Sri Lanka for the 1st time</p>
            <Button data-aos="fade-up" className='homecontbutton'>Visit now</Button>
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
        <Container>
          <h1 className='topic'>About us</h1>
          <div className='homeflex3'>

          </div>
        </Container>

        <Feedbacks />
      </Layout>
    </div>
  )
}

export default Home;
