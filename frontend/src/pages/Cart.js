import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { FaCheck, FaEdit, FaTrash } from 'react-icons/fa'
import Swal from 'sweetalert2';
import PreOrderTable from './PreOrderTable';

const Cart = () => {

    const [booking, setBooking] = useState([]);
    const [edit , setEdit] = useState({});
    const user = JSON.parse(localStorage.getItem('user'));
    const userMail = user ? user.email : null;

    useEffect(() => {
        if(userMail){
            getBooking(userMail);
        }
    },[userMail]);

    const getBooking = (userMail) => {
        Axios.get(`http://localhost:4000/api/Booking/${userMail}`)
             .then(response => {
                console.log('Data from server: ' ,response.data);
                setBooking(response.data);
             })
             .catch(error => {
                console.error("Axios error: " , error);
             });
    };

    const deleteBooking = (o_id) => {
        Axios.post(`http://localhost:4000/api/deleteBooking` , { o_id : o_id})
             .then(() => {
                getBooking(userMail);
                console.log('Successfully deleted ' , o_id);
             })
             .catch(error => {
                console.error("Axios error: " , error);
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

  return (
    <div>
      <Layout>
        <h1 className='text-center'>Your cart</h1>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
                <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Product name</TableCell>
                    <TableCell>Product price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Gross amount</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {booking && booking.length > 0 ? (
                    booking.map((order , index) => (
                        <TableRow key={order._id} sx={{'&:last-child id, &:last-child th' : { border: 1}}}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{order.pname}</TableCell>
                            <TableCell>{order.pprice}.00 LKR</TableCell>
                            <TableCell>
                                {edit[order.o_id] ?  (
                                    <><TextField
                                    type='number'
                                    min = {0}
                                    placeholder={order.quantity}
                                    value={edit[order.o_id] !== undefined ? edit[order.o_id] : order.quantity}
                                    onChange={(e) => {
                                        const newQuantity = parseInt(e.target.value);
                                        if(!isNaN(newQuantity) && newQuantity >= 0){
                                          setEdit(prevState => ({ ...prevState, [order.o_id]: newQuantity }));
                                        }
                                    }}/>
                                    <Button onClick={() => updateBooking(order.o_id, order.quantity)}>
                                        <FaCheck/></Button></>
                                ) : (
                                    <span>{order.quantity}</span>
                                )}</TableCell>
                            <TableCell>{order.pprice * order.quantity}.00 LKR</TableCell>
                            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Button onClick={() => setEdit({...edit,[order.o_id]: true})}><FaEdit/></Button>
                                <Button onClick={() => confirmDelete(order.o_id)}><FaTrash/></Button>
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
        <PreOrderTable/>
      </Layout>
    </div>
  )
}

export default Cart;
