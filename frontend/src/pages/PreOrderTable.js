import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout';
import { Button, Dialog, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { FaCheck, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Card, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PreOrderTable = () => {

    const [bookings, setBooking] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const [edit, setEdit] = useState({});
    const userMail = user ? user.email : null;
    const [open, setopen] = useState(false);
    const [pcheckout, setpCheckout] = useState([]);
    const [mobile, setMobile] = useState('');


    const Checkouts = (checkout) => {
        setpCheckout(checkout);
        setopen(true);
    }

    useEffect(() => {
        if (userMail) {
            getBooking(userMail);
        }
    }, [userMail]);

    const getBooking = (userMail) => {
        Axios.get(`http://localhost:4000/api/Prefer/${userMail}`)
            .then(response => {
                console.log('Data from server: ', response.data);
                setBooking(response.data);
            })
            .catch(error => {
                console.error("Axios error: ", error);
            });
    }

    const deleteBooking = (o_id) => {
        Axios.post(`http://localhost:4000/api/deleteprefer`, { o_id: o_id })
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

        Axios.post(`http://localhost:4000/api/updateprefer`, { o_id: o_id, quantity: quantity })
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
            confirmButtonText: "Yes, delete it!",
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

    const addPCheckout = async (e) => {
        e.preventDefault();

        try {

            const response = await Axios.post('http://localhost:4000/api/addPCheckout', {
                pname: pcheckout.pname,
                psize: pcheckout.psize,
                pTubeSize: pcheckout.pTubeSize,
                pGasType: pcheckout.pGasType,
                quantity: pcheckout.quantity,
                mobile: mobile,
                userMail: pcheckout.userMail,
            });
            deleteBooking(pcheckout.o_id);
            getBooking(userMail);
            console.log(response);
            toast.success('Your order is proccessing please wait for 2 or 3 days response via call!');
            setopen(false);
            Swal.fire({
                title: "Success!",
                text: "Checkout was added successfully!",
                icon: "success",
                showConfirmButton: false,
                timer: 2000
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <br />
            <br />
            <h1 className='text-center'>Prefer cart</h1>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Product name</TableCell>
                            <TableCell>Size</TableCell>
                            <TableCell>Tube size</TableCell>
                            <TableCell>Gas type</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings && bookings.length > 0 ? (
                            bookings.map((order, index) => (
                                <TableRow key={order._id} sx={{ '&:last-child id, &:last-child th': { border: 1 } }}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{order.pname}</TableCell>
                                    <TableCell>{order.psize}</TableCell>
                                    <TableCell>{order.pTubeSize}</TableCell>
                                    <TableCell>{order.pGasType}</TableCell>
                                    <TableCell>{edit[order.o_id] ? (
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
                                    <TableCell>
                                        <Button onClick={() => setEdit({ ...edit, [order.o_id]: true })}><FaEdit /></Button>
                                        <Button onClick={() => confirmDelete(order.o_id)}><FaTrash /></Button>
                                        <Button onClick={() => Checkouts(order)}>Checkout</Button>
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
                            <TableCell>{pcheckout.pname}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Size - </TableCell>
                            <TableCell>{pcheckout.psize}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Tube size - </TableCell>
                            <TableCell>{pcheckout.pTubeSize}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Gas type - </TableCell>
                            <TableCell>{pcheckout.pGasType}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Quantity - </TableCell>
                            <TableCell>{pcheckout.quantity}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Contact No - </TableCell>
                            <TableCell>
                                <Form>
                                    <Form.Control type='text'
                                        onChange={(e) => setMobile(e.target.value)}
                                    />
                                </Form>
                            </TableCell>
                        </TableRow>
                    </Table>
                    <br />
                    <Button onClick={addPCheckout}>COnfirm Checkout</Button>
                    <Button onClick={() => setopen(false)}>Cancel</Button>
                </Card>
            </Dialog>

        </div>
    )
}

export default PreOrderTable;
