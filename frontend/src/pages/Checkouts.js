import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { FaTrash } from 'react-icons/fa';

const Checkouts = () => {

    const [checkouts, setcheckouts] = useState([]);

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
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {checkouts && checkouts.length > 0 ? (
                            checkouts.map((checkout, index) => (
                                <TableRow key={checkout._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{checkout.pname}</TableCell>
                                    <TableCell>{checkout.pprice}</TableCell>
                                    <TableCell>{checkout.quantity}</TableCell>
                                    <TableCell>{checkout.userMail}</TableCell>
                                    <TableCell>{checkout.mobile}</TableCell>
                                    <TableCell style={{ color: checkout.status === 'Pending' ? 'red' : 'green', fontWeight: 'bold' }}>{checkout.status}</TableCell>
                                    <TableCell><FaTrash /></TableCell>
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

export default Checkouts
