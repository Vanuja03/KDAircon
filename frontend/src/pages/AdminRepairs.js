import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout';
import { Button, Dialog, DialogContent, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { FaCheck, FaCheckCircle, FaDotCircle, FaDownload, FaFilePdf, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Form } from 'react-bootstrap';
import '../styles/searchinput.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/adminrep.css';
import jsPDF from 'jspdf';
import kdlogo from '../images2/kdhomelg.png';
import Aos from 'aos';
import 'aos/dist/aos.css';

const AdminRepairs = () => {

    const [repairs, setrepairs] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const userMail = user ? user.email : null;
    const [filterstatus, setfilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedImage, setExpandedImage] = useState(null);

    const [Status, setstatus] = useState('');

    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, []);

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

    const genrepPdf = (repairs) => {
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
        const text = 'Your Repair Inquiry Summary';
        const textWidth = doc.getTextWidth(text);
        doc.text(text, 105, 60, { align: 'center' });
        doc.setLineWidth(0.5);
        doc.line((doc.internal.pageSize.width - textWidth) / 2, 62, (doc.internal.pageSize.width + textWidth) / 2, 62);

        // Add the repair details
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12); // Reset font to normal
        doc.text(`Customer name: ${repairs.cname}`, 15, 80);
        doc.text(`Customer Email: ${repairs.userMail}`, 15, 90);
        doc.text(`Bill No : ${repairs.billNo}`, 15, 100);
        doc.text(`Bill Date : ${repairs.billDate}`, 15, 110);
        doc.text(`Product name : ${repairs.pname}`, 15, 120);
        doc.text(`Contact number : ${repairs.mobile}`.toString(), 15, 130);
        if (repairs.status === 'Pending') {
            doc.setTextColor(255, 0, 0); // Red color
            doc.setFont('helvetica', 'bold');
            doc.text(`Current status : ${repairs.status}`, 15, 140);
        } else {
            doc.setTextColor(0, 128, 0); // Green color
            doc.setFont('helvetica', 'bold');
            doc.text(`Current status : ${repairs.status}`, 15, 140);
        }

        // Add the description text
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0);
        const descriptionText = `Issue: ${repairs.description}`;
        const descriptionLines = doc.splitTextToSize(descriptionText, 190); // Adjust width as needed
        doc.text(descriptionLines, 15, 150);

        // Add the "Images:" label closer to the images
        doc.text('Images:', 15, 175);

        // Add the images with smaller size and reduced margin
        let xPos = 15;
        let yPos = 185; // Reduced yPos to move images closer to the text
        if (Array.isArray(repairs.images)) {
            repairs.images.forEach((image, index) => {
                if (index > 0 && index % 3 === 0) {
                    yPos += 40; // Move to the next row
                    xPos = 15; // Reset xPos for the new row
                }
                const imageData = `data:${image.contentType};base64,${image.data}`;
                doc.addImage(imageData, 'JPEG', xPos, yPos, 50, 30); // Reduced dimensions
                xPos += 60; // Adjust horizontal spacing between images
            });
        } else {
            doc.text('No images available', 15, 170);
        }

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

        doc.save(`Repair inquiry summary_${repairs.cname}.pdf`);


    };


    return (
        <div>
            <Layout>
                <ToastContainer position="top-right"
                    autoClose={10000} // Close the toast after 3 seconds
                    hideProgressBar={false} // Show a progress bar
                    closeOnClick={false} />
                <h1 className='text-center'>Review repair inquiries</h1>
                <Form.Group style={{ marginLeft: '5%', fontWeight: 'bold' }} data-aos="fade-right">
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
                <Form.Group className="search-container" data-aos="fade-right">
                    <FaSearch className='searchicon' />
                    <input
                        className='search-input'
                        type='search'
                        placeholder='Search by Product name'
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </Form.Group>
                <TableContainer component={Paper} data-aos="fade-up">
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
                                            <Button onClick={() => genrepPdf(rep)}><FaFilePdf style={{ color: 'red', cursor: 'pointer' }} /></Button>
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
