import { MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap';
import { FaCheck } from 'react-icons/fa';
import Swal from 'sweetalert2';

const AdminCheckouts = () => {
    const [checkouts, setcheckouts] = useState([]);

    const [statusu, setstatus] = useState('');


    const getcheckout = async () => {

        try {
            const response = await Axios.get('http://localhost:4000/api/Checkout')

            console.log(response.data);
            setcheckouts(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getcheckout();
    }, []);


    const StatusUpdate = async (id) => {
        try {

            const response = await Axios.post('http://localhost:4000/api/statusupdate', { _id: id, status: statusu });
            if (response.status === 200) {
                getcheckout(); // Refresh the list after updating


                if (statusu == 'Completed') {
                    Swal.fire({
                        title: "Success!",
                        text: "Checkout was Completed view on completed table!",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
                } else {
                    Swal.fire({
                        title: "Success!",
                        text: "Checkout was pending view on pending table!",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleStatusChange = (id, event) => {
        const newStatus = event.target.value;
        StatusUpdate(id, newStatus);
    };


    const pendingCheckouts = checkouts.filter(checkout => checkout.status === 'Pending');
    const CompletedCheckouts = checkouts.filter(checkout => checkout.status === 'Completed');
    return (
        <div>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Product name</TableCell>
                            <TableCell>Unit price</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Contact No</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Update status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pendingCheckouts && pendingCheckouts.length > 0 ? (
                            pendingCheckouts.map((checkout, index) => (
                                <TableRow key={checkout._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{checkout.pname}</TableCell>
                                    <TableCell>{checkout.pprice}</TableCell>
                                    <TableCell>{checkout.quantity}</TableCell>
                                    <TableCell>{checkout.userMail}</TableCell>
                                    <TableCell>{checkout.mobile}</TableCell>
                                    <TableCell style={{ color: 'red', fontWeight: 'bold' }}>{checkout.status}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={statusu}
                                            onChange={(e) => setstatus(e.target.value)}
                                            name='status'
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                            <MenuItem value="Pending" style={{ color: 'red' }}>Pending</MenuItem>
                                            <MenuItem value="Completed" style={{ color: 'green' }}>Completed</MenuItem>
                                        </Select>
                                        {statusu === 'Completed' && (
                                            <Button onClick={() => StatusUpdate(checkout._id)}>
                                                <FaCheck />
                                            </Button>
                                        )}
                                    </TableCell>

                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                No checkouts yet !!!
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <br />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Product name</TableCell>
                            <TableCell>Unit price</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Contact No</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Update status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {CompletedCheckouts && CompletedCheckouts.length > 0 ? (
                            CompletedCheckouts.map((checkout, index) => (
                                <TableRow key={checkout._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{checkout.pname}</TableCell>
                                    <TableCell>{checkout.pprice}</TableCell>
                                    <TableCell>{checkout.quantity}</TableCell>
                                    <TableCell>{checkout.userMail}</TableCell>
                                    <TableCell>{checkout.mobile}</TableCell>
                                    <TableCell style={{ color: 'green', fontWeight: 'bold' }}>{checkout.status}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={statusu}
                                            onChange={(e) => setstatus(e.target.value)}
                                            name='status'
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                            <MenuItem value="Pending" style={{ color: 'red' }}>Pending</MenuItem>
                                            <MenuItem value="Completed" style={{ color: 'green' }}>Completed</MenuItem>
                                        </Select>
                                        {statusu === 'Pending' && (
                                            <Button onClick={() => StatusUpdate(checkout._id)}>
                                                <FaCheck />
                                            </Button>
                                        )}
                                    </TableCell>

                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                No checkouts yet !!!
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default AdminCheckouts
