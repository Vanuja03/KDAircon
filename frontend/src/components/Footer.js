import React from 'react'
import './F.css';
import { FaEnvelope, FaFacebook, FaMapMarkerAlt, FaPhone, FaTwitter, FaYoutube } from 'react-icons/fa'
import GoogleMap from '../pages/GoogleMap';
// import natlogo from '../webImages/natLogo.png';
// import fimg from '../webImages/footerimg.jpg';


const Footer = () => {
  return (
    <div className="footer">
      <div className="container_f">
        <div className='foothead'>
          {/* <img src={natlogo} width={85} height={100} alt='natlogo' /> */}
          <h2>KD Aircon Industries (PVT) Ltd</h2>
        </div>
        <div className="row_f">
          <div className="footer-col">
            <h4>Contact Information</h4>
            <ul>
              <FaMapMarkerAlt />
              <li><a href='https://maps.app.goo.gl/L3hXPygRfvxjYRXk6'>321/p1, Kalderam Maduwatte Rd,Panadura,
                Sri Lanka.</a></li>
              <FaPhone />
              <li><a href="tel: 0112694033">112 694033</a></li>
              <li><a href="tel: 0773207718">077 3207718</a></li>
              <li><a href="tel: 0772076147">077 2076147</a></li>
              <li><a href="tel: 0721880877">072 1880877</a></li>
              <FaEnvelope />
              <li>abcd@gov.lk</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Quick links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/cart">Store</a></li>
              <li><a href="/repair">Inquiry</a></li>
              <li><a href="/Checkouts">Checkouts</a></li>
              <li><a href="/PCheckouts">Customize Checkouts</a></li>
              <li><a href="/aboutus">About us</a></li>
              <li><a href="/news">News</a></li>

            </ul>
          </div>

          <div className="footer-col">
            <h4>follow us</h4>
            <div className="social-links">
              <a href="https://www.facebook.com" className='blue'><FaFacebook /></a>
              <a href="https://www.twitter.com" className='blue'><FaTwitter /></a>
              <a href="https://youtu.be/hdSMpcDsmmA?si=QEXjTB6qJAI4d5XE" className='red'><FaYoutube /></a>
              <br />
              {/* <img src={fimg} alt='nikndpuimage' /> */}
            </div>
          </div>
          <div>
            <GoogleMap />
          </div>
        </div>
      </div>
      <div className="copyright">
        <p>© Copyright 2024 KD Aircon Industries (Pvt) Ltd</p>
      </div>
    </div>

  )
}

export default Footer
