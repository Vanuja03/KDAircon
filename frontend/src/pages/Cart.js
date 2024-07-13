import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { FaCheck, FaEdit, FaFilePdf, FaSearch, FaTrash } from 'react-icons/fa'
import Swal from 'sweetalert2';
import PreOrderTable from './PreOrderTable';
import { Card, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'jspdf-autotable';
import '../styles/Nv.css';
import * as Yup from 'yup';
import '../styles/searchinput.css';
import Aos from 'aos';
import 'aos/dist/aos.css';
import '../styles/topics.css';
import cartimg from '../images2/cartimgs.png';
import '../styles/cart.css';

const Cart = () => {

  const [booking, setBooking] = useState([]);
  const [edit, setEdit] = useState({});
  const user = JSON.parse(localStorage.getItem('user'));
  const userMail = user ? user.email : null;
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobile, setMobile] = useState('');

  const [checkout, setcheckout] = useState([]);

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const [open, setopen] = useState(false);

  useEffect(() => {
    if (userMail) {
      getBooking(userMail);
    }
  }, [userMail]);

  const getBooking = (userMail) => {
    Axios.get(`http://localhost:4000/api/Booking/${userMail}`)
      .then(response => {
        console.log('Data from server: ', response.data);
        setBooking(response.data);

        // if (booking.length > 0) {
        //   toast.info(`You have ${booking.length} items in the Cart... `)
        // }
      })
      .catch(error => {
        console.error("Axios error: ", error);
      });
  };

  const deleteBooking = (o_id) => {
    Axios.post(`http://localhost:4000/api/deleteBooking`, { o_id: o_id })
      .then(() => {
        getBooking(userMail);
        console.log('Successfully deleted ', o_id);
      })
      .catch(error => {
        console.error("Axios error: ", error);
      });
  };

  const updateBooking = (o_id) => {
    const quantity = edit[o_id] !== undefined ? edit[o_id] : quantity;

    Axios.post(`http://localhost:4000/api/updateBooking`, { o_id: o_id, quantity: quantity })
      .then(() => {
        setEdit(prevState => ({ ...prevState, [o_id]: undefined }));
        getBooking(userMail);
        console.log('Successfully updated quantity for ', o_id);
      })
      .catch(error => {
        console.error('Axios error: ', error);
      });
  }

  const confirmDelete = (o_id) => {

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
        deleteBooking(o_id);
        swalWithBootstrapButtons.fire({
          title: "Deleted!",
          text: "Your product " + (o_id) + " has been deleted.",
          icon: "success"
        });
      }
    });
  }

  const Checkout = (product) => {

    setcheckout(product);
    setopen(true);
  }

  const validateSchema = Yup.object().shape({
    mobile: Yup.string().matches(/^0\d{9}$/, 'Invalid Contact Number').required('Contact Number is Required')
  })
  const addCheckout = async (e) => {
    e.preventDefault();

    try {
      await validateSchema.validate({ mobile }, { abortEarly: false })
      const response = await Axios.post('http://localhost:4000/api/addCheckout', {
        pname: checkout.pname,
        pprice: checkout.pprice,
        quantity: checkout.quantity,
        mobile: mobile,
        userMail: checkout.userMail,
      });
      deleteBooking(checkout.o_id);
      getBooking(userMail);
      console.log(response);
      toast.success('Your order is proccessing please wait for response via call!');

      setopen(false);
      Swal.fire({
        title: "Success!",
        text: "Checkout was added successfully please wait for response from us!",
        icon: "success",
        showConfirmButton: false,
        timer: 7000
      });



    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = {};
        error.inner.forEach(err => {
          errors[err.path] = err.message;
        });
        setErrorMessage(errors);
      } else {
        console.log(error);
      }
    }
  }

  const searchProduct = booking.filter(product =>
    product.pname.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div>
      <Layout>
        <PreOrderTable /><br />
        <h1 className='topic' data-aos="fade-up">Your cart</h1>
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
                <TableCell style={{ fontWeight: 'bold' }}>Product name</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Product price</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Quantity</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Gross amount</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Created At</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchProduct && searchProduct.length > 0 ? (
                searchProduct.map((order, index) => (
                  <TableRow key={order._id} sx={{ '&:last-child id, &:last-child th': { border: 1 } }}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{order.pname}</TableCell>
                    <TableCell>{order.pprice}.00 LKR</TableCell>
                    <TableCell>
                      {edit[order.o_id] ? (
                        <><TextField
                          type='number'
                          min={0}
                          placeholder={order.quantity}
                          value={edit[order.o_id] !== undefined ? edit[order.o_id] : order.quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value);
                            if (!isNaN(newQuantity) && newQuantity >= 0) {
                              setEdit(prevState => ({ ...prevState, [order.o_id]: newQuantity }));
                            }
                          }} />
                          <Button onClick={() => updateBooking(order.o_id, order.quantity)}>
                            <FaCheck /></Button></>
                      ) : (
                        <span>{order.quantity}</span>
                      )}</TableCell>
                    <TableCell>{order.pprice * order.quantity}.00 LKR</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button onClick={() => setEdit({ ...edit, [order.o_id]: true })}><FaEdit /></Button>
                      <Button onClick={() => confirmDelete(order.o_id)}><FaTrash /></Button>
                      <Button onClick={() => Checkout(order)}>Checkout</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>You haven't placed any orders yet!</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} fullWidth>
          <Card>
            <br />
            <center><h2>Confirm Checkout</h2></center><br />
            <Card.Subtitle>This order will proceed to buy</Card.Subtitle><br />
            <Table>
              <TableRow>
                <TableCell>Product name - </TableCell>
                <TableCell>{checkout.pname}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Unit price - </TableCell>
                <TableCell>{checkout.pprice} LKR</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quantity - </TableCell>
                <TableCell>{checkout.quantity}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Gross amount - </TableCell>
                <TableCell>{checkout.quantity * checkout.pprice} LKR</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Contact No - </TableCell>
                <TableCell>
                  <Form>
                    <Form.Control
                      className='no-spinner'
                      type='number'
                      maxLength={10}
                      onChange={e => setMobile(e.target.value.slice(0, 10))}
                    />
                    {errorMessage.mobile && <div className='text-danger'>{errorMessage.mobile}</div>}
                  </Form>
                </TableCell>
              </TableRow>
            </Table>
            <br />
            <Button onClick={addCheckout}>COnfirm Checkout</Button>
            <Button onClick={() => setopen(false)}>Cancel</Button>
          </Card>
        </Dialog>
        <img src={cartimg} className='cartimg' alt='cartimg' />
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={10000}
      />
    </div>
  )



}

export default Cart;


/**const genbill = () => {

    const doc = new jsPDF();

    const logo = new Image();
    logo.src = logo1;
    doc.addImage(logo, 'PNG', 20, 10, 20, 20);


    doc.setFontSize(12);
    doc.text('KD Aircon Industries (Pvt) Ltd', 45, 15);
    doc.text('321/P1,Kalderam Maduwatta,');
    doc.text('Wekada,Panadura.', 45, 25);

    doc.text('', 45, 35);

    doc.autoTable({
      head: [['Qty', 'Product name', 'Unit price', 'Total']],
      body: [checkout.quantity, checkout.pname, checkout.pprice, checkout.pprice * checkout.quantity],
      startY: 40,
      styles: {
        cellWidth: 'Auto',
        fontsize: 10,

      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 30 },
      },
    });

    doc.save('Bill.pdf');


  } */