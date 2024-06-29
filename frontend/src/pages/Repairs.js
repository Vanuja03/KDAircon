import { Button, Dialog, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaCheckCircle, FaDotCircle, FaEdit, FaSearch, FaTractor, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Layout from '../components/Layout';
import '../styles/repairs.css';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import '../styles/searchinput.css'

import 'swiper/css';

const Repairs = () => {

  const [repair, setRepair] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const userMail = user ? user.email : null;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [updateRepair, setUpdateRepair] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const openUpdatePopup = (repair) => {
    setUpdateRepair(repair);
    setOpen(true);
  }

  const closeUpdatePopup = () => {
    setOpen(false);
    setUpdateRepair({});
  }

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateRepair({
      ...updateRepair,
      [name]: value,
    })
  }
  const hanndleUpdateSave = async () => {
    try {
      const response = await Axios.post('http://localhost:4000/api/updateRepair', updateRepair);
      console.log('Update repair response : ', response.data);
      getRepair(userMail);
      closeUpdatePopup();
    } catch (error) {
      console.error('Error updating repair :', error);
    }
  }

  useEffect(() => {
    if (userMail) {
      getRepair(userMail);
    }
  }, [userMail]);

  const getRepair = (userMail) => {

    Axios.get(`http://localhost:4000/api/repair/${userMail}`)
      .then(response => {
        console.log('Data from server: ', response.data);
        setRepair(response.data);
      })
      .catch(error => {
        console.error("Axios error: ", error);
      });
  }

  const deleteRepair = (_id) => {

    Axios.post(`http://localhost:4000/api/deleteRepair`, { _id: _id })
      .then(() => {
        getRepair(userMail);
        setRepair((prevRepair) => prevRepair.filter((repairs) => repairs._id !== _id));
        console.log('Deleted successfully');

      })
      .catch(error => {
        console.error('Axios error: ', error);
      })
  }
  const confirmDelete = (_id) => {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it! ",
      cancelButtonText: " No, cancel!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRepair(_id);
        swalWithBootstrapButtons.fire({
          title: "Deleted!",
          text: "Your product " + (_id) + " has been deleted.",
          icon: "success"
        });
      }
    });
  }

  const searchRepairs = repair.filter(rep =>
    rep.pname.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div><Layout>
      <h1 className='text-center'>Your inquiries</h1>
      <Form.Group className="search-container">
        <FaSearch className='searchicon' />
        <input
          className='search-input'
          type='search'
          placeholder='Search by Product name'
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </Form.Group>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>BIll No</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Bill Date</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Product name</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Issue</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Images</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Contact number</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchRepairs && searchRepairs.length > 0 ? (
              searchRepairs.map((rep, index) => (

                <TableRow key={rep._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{rep.billNo}</TableCell>
                  <TableCell>{rep.billDate}</TableCell>
                  <TableCell>{rep.pname}</TableCell>
                  <TableCell>{rep.description}</TableCell>
                  <TableCell>
                    {Array.isArray(rep.images) ? (
                      rep.images.map((image, index) => (
                        <div className="imge" key={index} style={{ width: "50px", height: "100px" }}>
                          <img src={`data:${image.contentType};base64,${image.data}`} alt={`Image`} width={50} height={50} />
                        </div>
                      ))
                    ) : (
                      <div>No images available</div>
                    )}
                  </TableCell>
                  <TableCell>{rep.mobile}</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>
                    {rep.status === 'Pending' ? (
                      <span style={{ color: 'red' }}><FaDotCircle style={{ verticalAlign: 'middle' }} /> Pending</span>
                    ) : (
                      <span style={{ color: 'green' }}><FaCheckCircle style={{ verticalAlign: 'middle' }} /> Reviewed</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {rep.status === 'Pending' ? (
                      <Button onClick={() => navigate(`/updateR/${rep._id}/${rep.billNo}/${rep.billDate}/${rep.pname}/${rep.description}/${rep.mobile}`)}><FaEdit /></Button>
                    ) :
                      (
                        <Button style={{ color: 'gray', cursor: 'not-allowed' }}><FaEdit /></Button>
                      )}

                    {rep.status === 'Pending' ? (
                      <Button onClick={() => confirmDelete(rep._id)}><FaTrash /></Button>
                    ) :
                      (
                        <Button style={{ color: 'gray', cursor: 'not-allowed' }}><FaTrash /></Button>
                      )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>No inquiries left</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Row>
        {repair.map((rep) => (
          <Col key={rep._id} md={4}>
            <Card className='mb-4 cards'>
              <Swiper
                spaceBetween={5}
                slidesPerView={1}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }}
              >
                {Array.isArray(rep.images) ? (
                  rep.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div style={{ textAlign: 'center' }}>
                        <img
                          src={`data:${image.contentType};base64,${image.data}`}
                          alt={`Image ${index + 1}`}
                          width={50}
                          height={50}
                        />
                      </div>
                    </SwiperSlide>
                  ))
                ) : (
                  <div>No images available</div>
                )}
                <div className="swiper-button-next" style={{ color: 'black' }}></div>
                <div className="swiper-button-prev" style={{ color: 'black' }}></div>
              </Swiper>

              <Card.Body>
                <Card.Title>{rep.pname}</Card.Title>
                <Card.Text>{rep.billNo}</Card.Text>
                <Card.Text>{rep.billDate}</Card.Text>
                <Card.Text>{rep.description}</Card.Text>
                <br />

              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Dialog open={open}>
        <DialogTitle>Update Repair</DialogTitle>
        <DialogContent>
          <Form>
            <Row><Col>
              <Form.Label>ID : {updateRepair._id}</Form.Label>
              <Form.Group controlId='billNo'>
                <Form.Label>Bill No</Form.Label>
                <Form.Control
                  type='text'
                  name='billNo'
                  value={updateRepair.billNo}
                  onChange={handleUpdateChange}
                  required />
              </Form.Group>
              <Form.Group controlId='billDate'>
                <Form.Label>Bill Date</Form.Label>
                <Form.Control
                  type='date'
                  value={updateRepair.billDate}
                  name='billDate'
                  max={new Date().toISOString().split('T')[0]}
                  onChange={handleUpdateChange}
                  required />
              </Form.Group>
              <Form.Group controlId='mobile'>
                <Form.Label>Contact number</Form.Label>
                <Form.Control
                  type='text'
                  value={updateRepair.mobile}
                  name='mobile'
                  maxLength={10} // added maxLength attribute to limit input
                  onChange={handleUpdateChange}
                  required />
              </Form.Group>
            </Col>
              <Col>
                <Form.Group controlId='pname'>
                  <Form.Label>Product name</Form.Label>
                  <Form.Control
                    type='text'
                    value={updateRepair.pname}
                    name='pname'
                    onChange={handleUpdateChange}
                    required />
                </Form.Group>
                <Form.Group controlId='description'>
                  <Form.Label>Describe your issue</Form.Label>
                  <Form.Control
                    type='text'
                    value={updateRepair.description}
                    name='description'
                    onChange={handleUpdateChange}
                    required />
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Button variant='primary' onClick={hanndleUpdateSave}>
              Save changes
            </Button>
            <Button variant='primary' onClick={closeUpdatePopup}>
              Cancel
            </Button>
          </Form>
        </DialogContent>
      </Dialog>
    </Layout>
    </div>
  )
}

export default Repairs;
