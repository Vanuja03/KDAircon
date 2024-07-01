import { Button, Dialog, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaCheckCircle, FaDotCircle, FaEdit, FaFilePdf, FaSearch, FaTractor, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Layout from '../components/Layout';
import '../styles/repairs.css';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import '../styles/searchinput.css';
import jsPDF from 'jspdf';
import kdlogo from '../images2/kdhomelg.png';
import Aos from 'aos';
import 'aos/dist/aos.css';

import 'swiper/css';

const Repairs = () => {

  const [repair, setRepair] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const userMail = user ? user.email : null;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedImage, setExpandedImage] = useState(null);

  useEffect(() => {
    if (userMail) {
      getRepair(userMail);
    }
  }, [userMail]);

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

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

  const genrepPdf = (repairs) => {
    const doc = new jsPDF();

    const logo = new Image();
    logo.src = kdlogo;

    // Increase the width and height of the logo
    const logoWidth = 60;
    const logoHeight = 25;
    doc.addImage(logo, 'PNG', 10, 10, logoWidth, logoHeight);

    doc.setFontSize(12);
    doc.text('KD Aircon Industries Private Limited', 75, 15); // Adjusted x position to align with the wider logo
    doc.text('321/p1, Kalderam Maduwatte Rd,', 75, 20);
    doc.text('Panadura, Sri Lanka.', 75, 25);
    doc.text('Tel: Tel: 038-2249772, 077-2855178, 077-2076147', 75, 30);

    // Add page border
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'S');

    // Add horizontal line
    doc.setLineWidth(0.5);
    doc.line(5, 45, 205, 45);

    // Leave summary topic
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    const text = 'Your Repair Inquiry Summary';
    const textWidth = doc.getTextWidth(text);
    doc.text(text, 105, 60, { align: 'center' });
    doc.setLineWidth(0.5);
    doc.line((doc.internal.pageSize.width - textWidth) / 2, 62, (doc.internal.pageSize.width + textWidth) / 2, 62);

    // Add the repair details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12); // Reset font to normal
    doc.text(`Customer name: ${repairs.cname}`, 15, 80);
    doc.text(`Customer Email: ${repairs.userMail}`, 15, 90);
    doc.text(`Bill No : ${repairs.billNo}`, 15, 100);
    doc.text(`Bill Date : ${repairs.billDate}`, 15, 110);
    doc.text(`Product name : ${repairs.pname}`, 15, 120);
    doc.text(`Contact number : ${repairs.mobile}`.toString(), 15, 130);
    if (repairs.status === 'Pending') {
      doc.setTextColor(255, 0, 0); // Red color
      doc.setFont('helvetica', 'bold');
      doc.text(`Current status : ${repairs.status}`, 15, 140);
    } else {
      doc.setTextColor(0, 128, 0); // Green color
      doc.setFont('helvetica', 'bold');
      doc.text(`Current status : ${repairs.status}`, 15, 140);
    }

    // Add the description text
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);
    const descriptionText = `Issue: ${repairs.description}`;
    const descriptionLines = doc.splitTextToSize(descriptionText, 190); // Adjust width as needed
    doc.text(descriptionLines, 15, 150);

    // Add the "Images:" label closer to the images
    doc.text('Images:', 15, 175);

    // Add the images with smaller size and reduced margin
    let xPos = 15;
    let yPos = 185; // Reduced yPos to move images closer to the text
    if (Array.isArray(repairs.images)) {
      repairs.images.forEach((image, index) => {
        if (index > 0 && index % 3 === 0) {
          yPos += 40; // Move to the next row
          xPos = 15; // Reset xPos for the new row
        }
        const imageData = `data:${image.contentType};base64,${image.data}`;
        doc.addImage(imageData, 'JPEG', xPos, yPos, 50, 30); // Reduced dimensions
        xPos += 60; // Adjust horizontal spacing between images
      });
    } else {
      doc.text('No images available', 15, 170);
    }

    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
    doc.setFontSize(10);
    doc.text(`Generated on: ${formattedDate}`, doc.internal.pageSize.width - 15, 274, { align: 'right' });

    const pageHeight = doc.internal.pageSize.height;
    doc.setLineWidth(0.5);
    doc.line(5, pageHeight - 20, 205, pageHeight - 20);

    // Add footer text
    doc.setFontSize(10);
    doc.text('All rights reserved || KD Aircon Industries Pvt Limited', 105, pageHeight - 10, { align: 'center' });

    doc.save(`Repair inquiry summary_${repairs.cname}.pdf`);


  };

  const searchRepairs = repair.filter(rep =>
    rep.pname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageExpand = (imageData) => {
    setExpandedImage(imageData);
  };

  return (
    <div><Layout>
      <h1 className='text-center' data-aos="fade-up">Your inquiries</h1>
      <Form.Group className="search-container" data-aos="fade-left">
        <FaSearch className='searchicon' />
        <input
          className='search-input'
          type='search'
          placeholder='Search by Product name'
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </Form.Group>
      <TableContainer component={Paper} data-aos="fade-up">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Customer name</TableCell>
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
                  <TableCell>{rep.cname}</TableCell>
                  <TableCell>{rep.billNo}</TableCell>
                  <TableCell>{rep.billDate}</TableCell>
                  <TableCell>{rep.pname}</TableCell>
                  <TableCell style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', border: '1px solid #ddd', padding: '8px', textAlign: 'left', position: 'relative' }}>
                    <div style={{ overflowX: 'auto', maxWidth: '100%', height: '100%' }}>
                      {rep.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    {Array.isArray(rep.images) ? (
                      rep.images.map((image, index) => (
                        <div className="imge" key={index} style={{ width: "50px", height: "100px" }}>
                          <img src={`data:${image.contentType};base64,${image.data}`} alt={`Image`} width={50} height={50}
                            className='repimg'
                            onClick={() => handleImageExpand(image)}
                            style={{ cursor: 'pointer' }}
                          />
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
                      <Button onClick={() => navigate(`/updateR/${rep._id}/${rep.cname}/${rep.billNo}/${rep.billDate}/${rep.pname}/${rep.description}/${rep.mobile}`)}><FaEdit /></Button>
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
                    <Button onClick={() => genrepPdf(rep)}><FaFilePdf style={{ color: 'red', cursor: 'pointer' }} /></Button>
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
      <Dialog maxWidth="xl" open={expandedImage !== null} onClose={() => setExpandedImage(null)}>
        <DialogContent>
          {expandedImage && ( // Check if expandedImage is not null or undefined
            <img
              src={`data:${expandedImage.contentType};base64,${expandedImage.data}`}
              alt="Expanded Image"
              className='reppopimage'
            />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
    </div>
  )
}

export default Repairs;

/**<Row>
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
      </Dialog> */
