import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import Layout from '../components/Layout';
import { Button, Card, Container } from 'react-bootstrap';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import Axios from 'axios';
import { FaCheck, FaShoppingCart } from 'react-icons/fa';
const Profile = () => {

  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [checkouts, setCheckouts] = useState([]);
  const [booking, setBooking] = useState([]);
  const [pbooking, setPBooking] = useState([]);
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

  const yourcheckouts = checkouts.filter(checkout => checkout.userMail === userMail);

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
    <Layout>
      <div className="vh-100" style={{ backgroundColor: '#eee' }}>
        <MDBContainer className="container py-5 h-100">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol md="12" xl="4">
              <MDBCard style={{ borderRadius: '15px' }}>
                <MDBCardBody className="text-center">
                  <div className="mt-3 mb-4">
                    <MDBCardImage src={user.photoURL}
                      className="rounded-circle" fluid style={{ width: '100px' }} />
                  </div>
                  <MDBTypography tag="h4">{user.displayName}</MDBTypography>
                  <MDBCardText className="text-muted mb-4">
                    Customer <span className="mx-2">|</span> <a href="#!">{user.email}</a>
                  </MDBCardText>
                  <div className="mb-4 pb-2">
                    <Button onClick={() => navigate('/Checkouts')}><FaCheck />({yourcheckouts.length})</Button>
                    <Button onClick={() => navigate('/Cart')}><FaShoppingCart />{booking.length + pbooking.length}</Button>
                  </div>
                  <Button onClick={signOutUser} rounded size="sm">
                    Logout
                  </Button>
                  <div className="d-flex justify-content-between text-center mt-5 mb-2">
                    <div>
                      <MDBCardText className="mb-1 h5">8471</MDBCardText>
                      <MDBCardText className="small text-muted mb-0">Wallets Balance</MDBCardText>
                    </div>
                    <div className="px-3">
                      <MDBCardText className="mb-1 h5">8512</MDBCardText>
                      <MDBCardText className="small text-muted mb-0">Followers</MDBCardText>
                    </div>
                    <div>
                      <MDBCardText className="mb-1 h5">4751</MDBCardText>
                      <MDBCardText className="small text-muted mb-0">Total Transactions</MDBCardText>
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    </Layout>

  )
}

export default Profile
