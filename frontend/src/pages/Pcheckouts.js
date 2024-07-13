import { MenuItem, Select, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Form, Table } from 'react-bootstrap';
import { FaCheckCircle, FaCircleNotch, FaDotCircle, FaFilePdf, FaSearch, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/searchinput.css';
import jsPDF from 'jspdf';
import kdlogo from '../images2/kdhomelg.png';
import Aos from 'aos';
import 'aos/dist/aos.css';
import '../styles/topics.css';

const Pcheckouts = () => {

    const [checkouts, setCheckouts] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const [searchQuery, setSearchQuery] = useState('');
    const userMail = user ? user.email : null;
    const [filterstatus, setfilterStatus] = useState('All');

    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, []);

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

    const genChkPdf = (Chks) => {
        const doc = new jsPDF();

        const logo = new Image();
        logo.src = kdlogo;

        // Increase the width and height of the logo
        const logoWidth = 60;
        const logoHeight = 25;
        doc.addImage(logo, 'PNG', 10, 10, logoWidth, logoHeight);

        doc.setFontSize(12);
        doc.text('KD Aircon Industries Private Limited', 75, 15); // Adjusted x position to align with the wider logo
        doc.text('321/p1, Kalderam Maduwatte Rd,', 75, 20);
        doc.text('Panadura, Sri Lanka.', 75, 25);
        doc.text('Tel: Tel: 038-2249772, 077-2855178, 077-2076147', 75, 30);

        // Add page border
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'S');

        // Add horizontal line
        doc.setLineWidth(0.5);
        doc.line(5, 45, 205, 45);

        // Leave summary topic
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        const text = 'Your Customized Checkout';
        const textWidth = doc.getTextWidth(text);
        doc.text(text, 105, 60, { align: 'center' });
        doc.setLineWidth(0.5);
        doc.line((doc.internal.pageSize.width - textWidth) / 2, 62, (doc.internal.pageSize.width + textWidth) / 2, 62);

        // Add the repair details in table format
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12); // Reset font to normal

        const startX = 15;
        const startY = 80;
        const rowHeight = 10;
        let currentY = startY;

        const tableData = [
            ['Product name', Chks.pname],
            ['Size', Chks.psize],
            Chks.pGasType ? ['Gas type', Chks.pGasType] : null,
            Chks.pTubeSize ? ['Tube Size', Chks.pTubeSize] : null,
            ['Quantity', Chks.quantity],
            ['Current status', Chks.status],
            ['Contact No', Chks.mobile],
            ['Email', Chks.userMail]
        ].filter(row => row !== null); // Remove null rows

        // Draw table
        tableData.forEach(([key, value]) => {
            doc.text(key, startX, currentY);
            doc.text(':', startX + 50, currentY);
            doc.text(value.toString(), startX + 55, currentY);
            currentY += rowHeight;
        });

        // Change the color based on status
        if (Chks.status === 'Pending') {
            doc.setTextColor(255, 0, 0); // Red color
        } else if (Chks.status === 'In Progress') {
            doc.setTextColor(0, 0, 255); // Blue color
        } else {
            doc.setTextColor(0, 128, 0); // Green color
        }
        doc.setFont('helvetica', 'bold');
        doc.text(`Current status : ${Chks.status}`, startX, currentY);
        doc.setTextColor(0); // Reset color to black

        // Add the description text
        currentY += rowHeight;
        doc.setFont('helvetica', 'normal');
        doc.text(`Contact No : ${Chks.mobile}`, startX, currentY);
        currentY += rowHeight;
        doc.text(`Email : ${Chks.userMail}`, startX, currentY);

        // Add generation date
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
        doc.setFontSize(10);
        doc.text(`Generated on: ${formattedDate}`, doc.internal.pageSize.width - 15, 274, { align: 'right' });

        const pageHeight = doc.internal.pageSize.height;
        doc.setLineWidth(0.5);
        doc.line(5, pageHeight - 20, 205, pageHeight - 20);

        // Add footer text
        doc.setFontSize(10);
        doc.text('All rights reserved || KD Aircon Industries Pvt Limited', 105, pageHeight - 10, { align: 'center' });

        doc.save(`Checkout_${Chks.userMail}.pdf`);
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
            <h1 className='topic'>Customized order checkouts</h1>
            <ToastContainer autoClose={3000} />
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
                            <TableCell style={{ fontWeight: 'bold' }}>Contact No</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
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
                                        <FaFilePdf onClick={() => genChkPdf(checkout)} style={{ marginRight: '20%', color: 'red', cursor: 'pointer', fontSize: '1.5em' }} />
                                        {checkout.status === 'Pending' ? (
                                            <FaTrash onClick={() => deleteCheckout(checkout._id, checkout.status)} style={{ cursor: 'pointer', fontSize: '1.5em' }} />
                                        ) : (
                                            <span style={{ color: 'gray', cursor: 'not-allowed', fontSize: '1.5em' }}>
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
