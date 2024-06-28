import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Form, Table } from 'react-bootstrap';
import { FaCheckCircle, FaDotCircle, FaSearch, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/searchinput.css'

const Pcheckouts = () => {

    const [checkouts, setCheckouts] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const [searchQuery, setSearchQuery] = useState('');
    const userMail = user ? user.email : null;

    const getCheckout = async () => {
        try {
            const response = await Axios.get('http://localhost:4000/api/PCheckout');
            console.log(response.data);
            setCheckouts(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getCheckout();
    }, []);

    const deleteCheckout = async (_id, status) => {
        if (status === 'Completed') {
            toast.error('This checkout is already completed and cannot be deleted.');
            return;
        }

        try {
            await Axios.post(`http://localhost:4000/api/deletePCheckout`, { _id });
            setCheckouts((prevCheck) => prevCheck.filter((checkout) => checkout._id !== _id));
            toast.success('Deleted successfully');
        } catch (error) {
            console.error('Axios error: ', error);
            toast.error('Error deleting checkout');
        }
    };

    const yourcheckouts = checkouts.filter(checkout => checkout.userMail === userMail);
    const searchCheckouts = yourcheckouts.filter(yck =>
        yck.pname.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <div>
            <h1>Customized order checkouts</h1>
            <ToastContainer />
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
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Product name</TableCell>
                            <TableCell>Size</TableCell>
                            <TableCell>Gas type</TableCell>
                            <TableCell>Tube size</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Contact No</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {searchCheckouts && searchCheckouts.length > 0 ? (
                            searchCheckouts.map((checkout, index) => (
                                <TableRow key={checkout._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{checkout.pname}</TableCell>
                                    <TableCell>{checkout.psize}</TableCell>
                                    <TableCell>{checkout.pGasType}</TableCell>
                                    <TableCell>{checkout.pTubeSize}</TableCell>
                                    <TableCell>{checkout.quantity}</TableCell>
                                    <TableCell>{checkout.userMail}</TableCell>
                                    <TableCell>{checkout.mobile}</TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>
                                        {checkout.status === 'Pending' ? (
                                            <span style={{ color: 'red' }}><FaDotCircle style={{ verticalAlign: 'middle' }} /> Pending</span>
                                        ) : (
                                            <span style={{ color: 'green' }}><FaCheckCircle style={{ verticalAlign: 'middle' }} /> Completed</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {checkout.status === 'Pending' ? (
                                            <FaTrash onClick={() => deleteCheckout(checkout._id, checkout.status)} style={{ cursor: 'pointer' }} />
                                        ) : (
                                            <span style={{ color: 'gray', cursor: 'not-allowed' }}>
                                                <FaTrash />
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} align="center">No checkouts yet !!!</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default Pcheckouts
