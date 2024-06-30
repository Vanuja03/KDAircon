import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout';
import { Button, Dialog, DialogContent, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { FaCheck, FaCheckCircle, FaDotCircle, FaDownload, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Form } from 'react-bootstrap';
import '../styles/searchinput.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/adminrep.css';

const AdminRepairs = () => {

    const [repairs, setrepairs] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const userMail = user ? user.email : null;
    const [filterstatus, setfilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedImage, setExpandedImage] = useState(null);

    const [Status, setstatus] = useState('');

    const getRepairs = () => {
        Axios.get('http://localhost:4000/api/Allrepairs')
            .then(response => {
                console.log('data from sever', response.data);
                setrepairs(response.data);
                const pendingRepairs = response.data.filter(repair => repair.status === 'Pending').length;
                if (pendingRepairs > 0) {
                    toast.info(`You have ${pendingRepairs} pending repairs. Review them`);
                }
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


                if (Status === 'Reviewed') {
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

    const handleImageExpand = (imageData) => {
        setExpandedImage(imageData);
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = `data:${expandedImage.contentType};base64,${expandedImage.data}`;
        link.download = 'image.jpg'; // Set the filename for download
        link.click();
        toast.success('Image download successfully');
    };

    return (
        <div>
            <Layout>
                <ToastContainer position="top-right"
                    autoClose={10000} // Close the toast after 3 seconds
                    hideProgressBar={false} // Show a progress bar
                    closeOnClick={false} />
                <h1 className='text-center'>Review repair inquiries</h1>
                <Form.Group style={{ marginLeft: '5%', fontWeight: 'bold' }}>
                    <Form.Label>Filter by status</Form.Label>
                    <Select
                        value={filterstatus}
                        onChange={handleFilterChange}
                        name='filterstatus'
                        displayEmpty
                        inputProps={{ 'aria-label': 'without label' }}
                        style={{ marginLeft: '1%' }}>
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
                                <TableCell style={{ fontWeight: 'bold' }}>Customer name</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>BIll No</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Bill Date</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Product name</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Issue</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Images</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Contact number</TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>Repair Status</TableCell>
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
                                                            className='repimgs'
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
                <Dialog maxWidth="xl" open={expandedImage !== null} onClose={() => setExpandedImage(null)}>
                    <DialogContent>
                        <FaDownload onClick={handleDownload} style={{ marginBottom: '5%', fontSize: '2em', cursor: 'pointer', color: 'black', marginLeft: '90%' }} />
                        {expandedImage && ( // Check if expandedImage is not null or undefined
                            <img
                                src={`data:${expandedImage.contentType};base64,${expandedImage.data}`}
                                alt="Expanded Image"
                                className='reppopimages'
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </Layout>
        </div>
    )
}


export default AdminRepairs;


/**  */
