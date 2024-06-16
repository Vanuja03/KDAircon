import React from 'react'
import Layout from '../components/Layout';
import backq from '../images2/backtest.mp4';
import '../styles/home.css'
import Feedbacks from './Feedbacks';

const Home = () => {
  return (
    <div>
      <Layout>
        <video className='videoss' autoPlay loop muted>
          <source src={backq} type="video/mp4" />
        </video>
        <Feedbacks />
      </Layout>
    </div>
  )
}

export default Home;
