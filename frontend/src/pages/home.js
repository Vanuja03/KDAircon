import React from 'react'
import Layout from '../components/Layout';
import backq from '../images2/backtest.mp4';
import '../styles/home.css'
import Feedbacks from './Feedbacks';
import { Button, Container } from 'react-bootstrap';

const Home = () => {
  return (
    <div>
      <Layout>

        <Container className='homecontainer1'>
          <div className='homediv11'>
            <h1>Be cool at your own place</h1>
            <p className='homep'>Explore the new invention of Sri Lanka for the 1st time</p>
            <Button className='homecontbutton'>Visit now</Button>
          </div>
          <video className='videoss' autoPlay loop muted disablePictureInPicture>
            <source src={backq} type="video/mp4" />
          </video>
        </Container>

        <Container className='homecontainer2'>
          <div>
            <h3>Instant service</h3>
          </div>
          <div>
            <h3>fast delivery</h3>
          </div>
          <div>
            <h3>govenment approved</h3>
          </div>
          <div>
            <h3> warranties included</h3>
          </div>

        </Container>
        <Container>
          <h1>Best sellers</h1>
          <div className='homeflex3'>

          </div>
        </Container>

        <Feedbacks />
      </Layout>
    </div>
  )
}

export default Home;
