import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { Button, Card, Container } from 'react-bootstrap';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import Axios from 'axios';
import { FaArrowAltCircleRight, FaArrowRight, FaCaretUp, FaCheck, FaShoppingBag, FaShoppingCart } from 'react-icons/fa';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import Checkouts from './Checkouts';
import Repairs from './Repairs';

import '../styles/profile.css';
import Cart from './Cart';
const Profile = () => {

  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [checkouts, setCheckouts] = useState([]);
  const [pcheckouts, setPCheckouts] = useState([]);
  const [booking, setBooking] = useState([]);
  const [pbooking, setPBooking] = useState([]);
  const [open1, setopen1] = useState(false);
  const [open2, setopen2] = useState(false);
  const userMail = user ? user.email : null;

  const getCheckout = async () => {
    try {
      const response = await Axios.get('http://localhost:4000/api/Checkout');
      console.log(response.data);
      setCheckouts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getPCheckout = async () => {
    try {
      const response = await Axios.get('http://localhost:4000/api/PCheckout');
      console.log(response.data);
      setPCheckouts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const yourcheckouts = checkouts.filter(checkout => checkout.userMail === userMail);
  const yourpcheckouts = pcheckouts.filter(checkout => checkout.userMail === userMail);

  const getBooking = (userMail) => {
    Axios.get(`http://localhost:4000/api/Booking/${userMail}`)
      .then(response => {
        console.log('Data from server: ', response.data);
        setBooking(response.data);
      })
      .catch(error => {
        console.error("Axios error: ", error);
      });
  };

  const getPBooking = (userMail) => {
    Axios.get(`http://localhost:4000/api/Prefer/${userMail}`)
      .then(response => {
        console.log('Data from server: ', response.data);
        setPBooking(response.data);
      })
      .catch(error => {
        console.error("Axios error: ", error);
      });
  }

  useEffect(() => {
    getCheckout();
    getPCheckout();
  }, []);

  useEffect(() => {
    if (userMail) {
      getBooking(userMail);
      getPBooking(userMail);
    }
  }, [userMail]);



  const signOutUser = async () => {
    try {

      await signOut(auth);
      if (window.confirm('Are you sure ?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      <div >
        {/* <FaCaretUp style={{ justifyContent: 'right' }} /> */}
        <MDBCard style={{ borderRadius: '15px' }}>
          <MDBCardBody className="text-center">
            <div className='headoprof'>
              <div className="mt-3 mb-4 profimage">
                <MDBCardImage src={user.photoURL}
                  className="rounded-circle " fluid style={{ width: '100px', border: '5px solid blue' }} />
              </div>
              <MDBTypography tag="h4">{user.displayName}</MDBTypography>
              <MDBCardText className="text-muted mb-4">
                Customer <span className="mx-2">|</span> <a href="#!">{user.email}</a>
              </MDBCardText>
              <hr style={{ color: 'black', marginTop: '-10px' }} />
              <div className="mb-4 pb-2" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <Button onClick={() => navigate('/Checkouts')}><FaShoppingBag /> ({yourcheckouts.length + yourpcheckouts.length})</Button>
                <Button onClick={() => navigate('/Cart')}><FaShoppingCart /> {booking.length + pbooking.length}</Button>
              </div>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              marginLeft: '5px',
              marginRight: '5px'
            }}>
              <div className='disflexprof' onClick={() => navigate('/repairs')}>
                <span>Your repairs</span>
                <span><FaArrowRight /></span>
              </div>
              <div className='disflexprof' onClick={() => navigate('/feedbacks')}>
                <span>Your feedbacks</span>
                <span><FaArrowRight /></span>
              </div>
              <div className='disflexprof' onClick={() => navigate('/Checkouts')}>
                <span>Your Checkouts</span>
                <span><FaArrowRight /></span>
              </div>
            </div>
          </MDBCardBody>
          <Button onClick={signOutUser} rounded size="md" className='signoutbtn'>
            Logout
          </Button>
        </MDBCard>
      </div>
      <Dialog open={open1} fullWidth>
        <Checkouts />
      </Dialog>
      <Dialog open={open2} fullWidth>
        <Cart />
      </Dialog>
    </>



  )
}

export default Profile
