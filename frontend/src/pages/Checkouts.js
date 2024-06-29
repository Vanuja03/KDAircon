import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { FaCircle, FaTrash, FaDotCircle, FaCheckCircle, FaSearch, FaCircleNotch } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/searchinput.css'
import { Form } from 'react-bootstrap';
import Pcheckouts from './Pcheckouts';
import Layout from '../components/Layout';

const Checkouts = () => {
    const [checkouts, setCheckouts] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const [searchQuery, setSearchQuery] = useState('');
    const userMail = user ? user.email : null;
    const [filterstatus, setfilterStatus] = useState('All');

    const getCheckout = async () => {
        try {
            const response = await Axios.get('http://localhost:4000/api/Checkout');
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
            await Axios.post(`http://localhost:4000/api/deleteCheckout`, { _id });
            setCheckouts((prevCheck) => prevCheck.filter((checkout) => checkout._id !== _id));
            toast.success('Deleted successfully');
        } catch (error) {
            console.error('Axios error: ', error);
            toast.error('Error deleting checkout');
        }
    };

    const yourcheckouts = checkouts.filter(checkout => checkout.userMail === userMail);

    const handleFilterChange = (event) => {
        setfilterStatus(event.target.value);
    };

    const filteredCheckouts = filterstatus === 'All'
        ? yourcheckouts
        : yourcheckouts.filter(check => check.status === filterstatus);


    const searchCheckouts = filteredCheckouts.filter(yck =>
        yck.pname.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <div>
            <Layout>
                <h1 className='text-center'>Your checkouts</h1>
                <Form.Group style={{ marginLeft: '5%', fontWeight: 'bold' }}>
                    <Form.Label>Filter by Status</Form.Label>
                    <Select
                        value={filterstatus}
                        onChange={handleFilterChange}
                        name='filterstatus'
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        style={{ marginLeft: '1%' }}>
                        <MenuItem value='All'>All</MenuItem>
                        <MenuItem value='Pending' style={{ color: 'red', fontWeight: 'bold' }}>Pending</MenuItem>
                        <MenuItem value='In Progress' style={{ color: 'blue', fontWeight: 'bold' }}>In Progress</MenuItem>
                        <MenuItem value='Completed' style={{ color: 'green', fontWeight: 'bold' }}>Completed</MenuItem>
                    </Select>
                </Form.Group>
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
                <ToastContainer />
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
                            {searchCheckouts && searchCheckouts.length > 0 ? (
                                searchCheckouts.map((checkout, index) => (
                                    <TableRow key={checkout._id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{checkout.pname}</TableCell>
                                        <TableCell>{checkout.pprice}</TableCell>
                                        <TableCell>{checkout.quantity}</TableCell>
                                        <TableCell>{checkout.userMail}</TableCell>
                                        <TableCell>{checkout.mobile}</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>
                                            {checkout.status === 'Pending' ? (
                                                <span style={{ color: 'red' }}><FaDotCircle style={{ verticalAlign: 'middle' }} /> Pending</span>
                                            ) : checkout.status === 'In Progress' ? (
                                                <span style={{ color: 'blue' }}>
                                                    <FaCircleNotch style={{ verticalAlign: 'middle' }} /> In Progress
                                                </span>
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
                <br />
                <Pcheckouts />
            </Layout>
        </div>
    );
};

export default Checkouts;
