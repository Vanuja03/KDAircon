import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout';
import { Button, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { FaCheck, FaCheckCircle, FaDotCircle, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Form } from 'react-bootstrap';
import '../styles/searchinput.css'

const AdminRepairs = () => {

    const [repairs, setrepairs] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const userMail = user ? user.email : null;
    const [filterstatus, setfilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const [Status, setstatus] = useState('');

    const getRepairs = () => {
        Axios.get('http://localhost:4000/api/Allrepairs')
            .then(response => {
                console.log('data from sever', response.data);
                setrepairs(response.data);
            })
            .catch(error => {
                console.error("Axios error:", error);
            })
    }

    useEffect(() => {
        getRepairs();
    }, []);


    const RepairUpdate = async (id) => {
        try {
            const response = await Axios.post('http://localhost:4000/api/repairstatus', { _id: id, status: Status });
            if (response.status === 200) {
                getRepairs(); // Refresh the list after updating


                if (Status == 'Reviewed') {
                    Swal.fire({
                        title: "Success!",
                        text: "Checkout was Reviewed view on completed table!",
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

    console.log(repairs.length);

    const handleFilterChange = (event) => {
        setfilterStatus(event.target.value);
    };

    const filteredRepairs = filterstatus === 'All'
        ? repairs
        : repairs.filter(rep => rep.status === filterstatus);


    const searchRepairs = filteredRepairs.filter(product =>
        product.pname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <Layout>
                <h1 className='text-center'>Review repair inquiries</h1>
                <Form.Group>
                    <Form.Label>Filter by status</Form.Label>
                    <Select
                        value={filterstatus}
                        onChange={handleFilterChange}
                        name='filterstatus'
                        displayEmpty
                        inputProps={{ 'aria-label': 'without label' }}>
                        <MenuItem value='All'>All</MenuItem>
                        <MenuItem value='Pending' style={{ color: 'red', fontWeight: 'bold' }}>Pending</MenuItem>
                        <MenuItem value='Reviewed' style={{ color: 'green', fontWeight: 'bold' }}>Reviewed</MenuItem>
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
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>BIll No</TableCell>
                                <TableCell>Bill Date</TableCell>
                                <TableCell>Product name</TableCell>
                                <TableCell>Issue</TableCell>
                                <TableCell>Images</TableCell>
                                <TableCell>Contact number</TableCell>
                                <TableCell>Repair Status</TableCell>
                                <TableCell>Actions</TableCell>
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
                                            <Select
                                                value={Status}
                                                onChange={(e) => setstatus(e.target.value)}
                                                name='status'
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                            >
                                                <MenuItem value="Pending" style={{ color: 'red' }}>Pending</MenuItem>
                                                <MenuItem value="Reviewed" style={{ color: 'green' }}>Reviewed</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Button onClick={() => RepairUpdate(rep._id)}>
                                                <FaCheck />
                                            </Button>
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

            </Layout>
        </div>
    )
}


export default AdminRepairs;


/**  */
