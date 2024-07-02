import { MenuItem, Select, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Form, Table } from 'react-bootstrap';
import { FaCheck, FaCheckCircle, FaCircleNotch, FaDotCircle, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Layout from '../components/Layout';
import '../styles/searchinput.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Aos from 'aos';
import 'aos/dist/aos.css';
import '../styles/topics.css';

const AdminPCheckouts = () => {

    const [checkouts, setcheckouts] = useState([]);
    const [statusu, setstatus] = useState('');
    const [filterstatus, setfilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, []);

    const getcheckout = async () => {

        try {
            const response = await Axios.get('http://localhost:4000/api/PCheckout')
            const pendingCheckoutsCount = response.data.filter(checkout => checkout.status === 'Pending').length;
            if (pendingCheckoutsCount > 0) {
                toast.info(`You have ${pendingCheckoutsCount} pending checkouts`);
            }
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

            const response = await Axios.post('http://localhost:4000/api/statusPupdate', { _id: id, status: statusu });
            if (response.status === 200) {
                getcheckout(); // Refresh the list after updating


                if (statusu === 'Completed') {
                    Swal.fire({
                        title: "Success!",
                        text: "Checkout is Completed view on completed table!",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
                } else if (statusu === 'Pending') {
                    Swal.fire({
                        title: "Success!",
                        text: "Checkout is pending view on pending table!",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
                } else {
                    Swal.fire({
                        title: "Success!",
                        text: "Checkout is in progress  view on in progress table!",
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

    const handleFilterChange = (event) => {
        setfilterStatus(event.target.value);
    };

    const filteredCheckouts = filterstatus === 'All'
        ? checkouts
        : checkouts.filter(check => check.status === filterstatus);

    const searchCheckouts = filteredCheckouts.filter(product =>
        product.pname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <Layout>
                <ToastContainer position="top-right"
                    autoClose={10000} // Close the toast after 3 seconds
                    hideProgressBar={false} // Show a progress bar
                    closeOnClick={false} />
                <h1 className='topic'>Preffered Checkouts</h1>
                <Form.Group style={{ marginLeft: '5%', fontWeight: 'bold' }} data-aos="fade-right">
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
                <TableContainer data-aos="fade-up">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Product name</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Size</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Gas type</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Tube size</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Quantity</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Contact No</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Date and Time</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Update status</TableCell>
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
                                        <TableCell><a href={`mailto:${checkout.userMail}`}>{checkout.userMail}</a></TableCell>
                                        <TableCell><a href={`tel:${checkout.mobile}`}>{checkout.mobile}</a></TableCell>
                                        <TableCell>{new Date(checkout.createdAt).toLocaleDateString()}  -  {new Date(checkout.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
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
                                            <Select
                                                value={statusu}
                                                onChange={(e) => setstatus(e.target.value)}
                                                name='status'
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                            >
                                                <MenuItem value="Pending" style={{ color: 'red' }}>Pending</MenuItem>
                                                <MenuItem value='In Progress' style={{ color: 'blue' }}>In Progress</MenuItem>
                                                <MenuItem value="Completed" style={{ color: 'green' }}>Completed</MenuItem>
                                            </Select>
                                            <Button onClick={() => StatusUpdate(checkout._id)}>
                                                <FaCheck />
                                            </Button>
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
            </Layout>
        </div>
    )
}

export default AdminPCheckouts
