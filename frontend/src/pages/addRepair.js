import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import Axios from 'axios'
import Swal from 'sweetalert2'
import Repairs from './Repairs'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import '../styles/addrep.css';
import Login from './googlelogin'
import { Dialog } from '@mui/material'

const AddRepair = () => {

    const [billNo, setbNo] = useState('');
    const [billDate, setbdate] = useState('');
    const [pname, setpname] = useState('');
    const [description, setdesc] = useState('');
    const [images, setpimages] = useState(null);
    const [mobile, setMobile] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const user = JSON.parse(localStorage.getItem('user'));
    const userMail = user ? user.email : null;
    const navigate = useNavigate();

    const [logopen, setlogopen] = useState(true);

    const onInputChange = (e) => {
        const files = Array.from(e.target.files).slice(0, 5);
        setpimages(files);

        // Create an array to store image previews
        const previews = [];
        // Iterate through each selected file
        files.forEach((file) => {
            // Create a FileReader object
            const reader = new FileReader();
            // Set up onload event handler
            reader.onload = () => {
                // Add the base64 encoded data URI to the previews array
                previews.push(reader.result);
                // If previews array has the same length as the selected files, update state with previews
                if (previews.length === files.length) {
                    setImagePreview(previews);
                }
            };
            // Read the selected file as a data URL
            reader.readAsDataURL(file);
        });
    }

    const validateSchema = Yup.object().shape({
        billNo: Yup.number().required('Bill No is Required'),
        pname: Yup.string().required('Product name is required'),
        billDate: Yup.string().required('Date is required'),
        description: Yup.string().required('Repair Description required'),
        images: Yup.mixed().required('Photos are required').test('file-size', 'Please upload at most 5 files', (files) => files.length <= 5)
            .test('file-type', 'Only image files are allowed', (files) => files.every((file) => file.type.match(/^image\/(png|jpeg|jpg)$/))),
        mobile: Yup.string().matches(/^0\d{9}$/, 'Invalid Contact Number').required('Contact number is Required'),
    });

    const addRep = async () => {

        try {

            await validateSchema.validate({ billNo, billDate, pname, description, images, mobile }, { abortEarly: false });

            const formData = new FormData();
            formData.append("billNo", billNo);
            formData.append("billDate", billDate);
            formData.append("pname", pname);
            formData.append("description", description);
            formData.append("mobile", mobile);
            formData.append("userMail", userMail);

            for (let i = 0; i < images.length; i++) {
                formData.append('images', images[i]);
            }

            for (var pair of formData.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }
            console.log(formData.get("images"));

            const response = await Axios.post('http://localhost:4000/api/addRepair', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            toast.success('Wait a second !');
            console.log('Add product response: ', response.data);
            await Swal.fire({
                title: "Repair submitted successfully!",
                text: "wait for a call from us in two days",
                icon: "success",
            }).then((result) => {
                if (result.isConfirmed) {
                    setbNo('');
                    setbdate('');
                    setpname('');
                    setdesc('');
                    setpimages(null);
                    setMobile('');
                    setImagePreview(null);
                }
            });
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors = {};
                error.inner.forEach((err) => {
                    if (err.path === 'evidence') {
                        errors[err.path] = err.message;
                    } else {
                        errors[err.path] = err.message;
                        setErrorMessage(errors);
                    }
                });
                setErrorMessage(errors);
            } else {
                console.error('Error adding product: ', error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!"
                });
            }
        }

    }

    const Repair = () => {

        navigate('/repairs');
    }

    if (user) {
        return (
            <div>
                <Layout>

                    <h1 className='text-center' style={{ marginTop: '20px' }}>Add a Repair inquiry</h1><br />
                    <Form className='addrepform'>
                        <Row><Col>
                            <Form.Group >
                                <Form.Label>Bill No</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={billNo}
                                    onChange={e => setbNo(e.target.value)}
                                    required />
                                {errorMessage.billNo && <div className="text-danger">{errorMessage.billNo}</div>}
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Bill Date</Form.Label>
                                <Form.Control
                                    type='date'
                                    value={billDate}
                                    max={new Date().toISOString().split('T')[0]}
                                    onChange={e => setbdate(e.target.value.toString())}
                                    required />
                                {errorMessage.billDate && <div className="text-danger">{errorMessage.billDate}</div>}
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Contact number</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={mobile}
                                    onChange={e => setMobile(e.target.value.slice(0, 10))}
                                    maxLength={10} // added maxLength attribute to limit input
                                    required />
                                {errorMessage.mobile && <div className="text-danger">{errorMessage.mobile}</div>}
                            </Form.Group>
                        </Col>
                            <Col>
                                <Form.Group >
                                    <Form.Label>Product name</Form.Label>
                                    <Form.Control
                                        type='text'
                                        value={pname}
                                        onChange={e => setpname(e.target.value)}
                                        required />
                                    {errorMessage.pname && <div className="text-danger">{errorMessage.pname}</div>}
                                </Form.Group>
                                <Form.Group >
                                    <Form.Label>Describe your issue</Form.Label>
                                    <Form.Control
                                        type='text'
                                        value={description}
                                        onChange={e => setdesc(e.target.value)}
                                        required />
                                    {errorMessage.description && <div className="text-danger">{errorMessage.description}</div>}
                                </Form.Group>
                            </Col>
                            <Form.Group style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                <Form.Label>Input some images on your issue</Form.Label>
                                <Form.Control
                                    type='file'
                                    accept='image/'
                                    width={400}
                                    onChange={onInputChange}
                                    multiple />

                                {imagePreview && imagePreview.map((preview, index) => (
                                    <div key={index} style={{ marginRight: '10px', marginBottom: '10px' }}>
                                        <img src={preview} alt={`Preview ${index}`} style={{ width: '150px', height: '150px' }} />
                                    </div>
                                ))}
                                {errorMessage.images && <div className="text-danger">{errorMessage.images}</div>}
                            </Form.Group>

                        </Row>
                        <br />
                        <div className='addrepdiv1'>
                            <Button variant='primary' onClick={addRep}>
                                Submit
                            </Button>
                            <Button variant='primary' onClick={Repair}>
                                Your repairs
                            </Button>
                        </div>
                    </Form>

                </Layout>
                <ToastContainer
                    position="top-right"
                    autoClose={1500} // Close the toast after 3 seconds
                />
            </div>
        )
    } else {
        return (
            <div>
                <Layout>
                    <Dialog open={logopen}>
                        <Card style={{ paddingTop: '5%', paddingBottom: '5%', paddingLeft: '5%', paddingRight: '5%' }}>
                            <Card.Title className='text-center' style={{ fontSize: '1.5em' }}>Please login first to add a inquiry</Card.Title>
                            <Card.Body>
                                <Login />
                                <Button style={{ marginTop: '8%', marginLeft: '60%' }} onClick={() => navigate('/')}>Go back</Button>
                            </Card.Body>
                        </Card>
                    </Dialog>
                </Layout>
                <ToastContainer
                    position="top-right"
                    autoClose={1500} // Close the toast after 3 seconds
                />
            </div>
        )
    }
}

export default AddRepair;
