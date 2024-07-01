import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Button, Form, Alert, Col, Row } from 'react-bootstrap'
import Axios from 'axios';
import Products from './Products';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import Aos from 'aos';
import 'aos/dist/aos.css';


const AddProduct = () => {

    const [pid, setpid] = useState(0);
    const [pname, setpname] = useState('');
    const [pdescription, setpdescription] = useState('');
    const [pprice, setpprice] = useState(0);
    const [pquantity, setpquantity] = useState(0);
    const [pimage, setpimage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [IerrorMessage, setIErrorMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const validateSchema = Yup.object().shape({
        pid: Yup.number()
            .typeError('Product ID must be a number')
            .required('Product ID is required')
            .test('is-not-zero', 'Product ID must not be 0', value => value !== 0),
        pname: Yup.string().required('Product name is required'),
        pdescription: Yup.string().required('Description is required'),
        pprice: Yup.number()
            .typeError('Please enter a valid unit price')
            .required('Please enter unit price')
            .min(0, 'Price cannot be negative')
            .test('is-not-zero', 'Product price must not be 0', value => value !== 0),
        pquantity: Yup.number()
            .typeError('Please enter a valid quantity')
            .required('Please enter quantity')
            .min(0, 'Quantity cannot be negative')
            .test('is-not-zero', 'Product quantity must not be 0', value => value !== 0),
        pimage: Yup.mixed().required('Please add a product Image')
    })

    const onInputChange = (e) => {
        const file = e.target.files[0];
        setpimage(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    }

    const addProduct = async () => {

        // if (!pimage) {
        //     setIErrorMessage('Please add a product Image');
        //     return;
        // }
        try {

            await validateSchema.validate(
                {
                    pid,
                    pname,
                    pdescription,
                    pprice,
                    pquantity,
                    pimage
                },
                { abortEarly: false }
            );

            const formData = new FormData();
            formData.append("pid", pid);
            formData.append("pname", pname);
            formData.append("pdescription", pdescription);
            formData.append("pprice", pprice);
            formData.append("pquantity", pquantity);
            formData.append("image", pimage);

            const response = await Axios.post('http://localhost:4000/api/addProduct', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            console.log('Add product response: ', response.data);
            await Swal.fire({
                title: "Product added successfully!",
                text: "Look at your products page below!",
                icon: "success",
            }).then((result) => {
                if (result.isConfirmed) {
                    setpid(0);
                    setpname('');
                    setpdescription('');
                    setpprice(0);
                    setpquantity(0);
                    setpimage(null);
                    setImagePreview(null);
                }
            });
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors = {};
                error.inner.forEach(err => {
                    errors[err.path] = err.message;
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

    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, []);

    return (
        <>
            <div className='page'>
                <Layout>
                    <h1 className='text-center' data-aos="fade-bottom">Add product</h1>
                    <Form style={{ marginLeft: '2%', marginRight: '2%' }} data-aos="fade-right">
                        <Row>
                            <Col>
                                <Form.Group controlId='pID'>
                                    <Form.Label>Product ID (<b>please do not enter same id twice look your added products in Below </b>)</Form.Label>
                                    <Form.Control
                                        type='number'
                                        min={0}
                                        value={pid}
                                        onChange={e => setpid(e.target.value)}
                                        required />

                                </Form.Group>
                                {errorMessage.pid && <div className="text-danger">{errorMessage.pid}</div>}
                                <Form.Group controlId='pID'>
                                    <Form.Label>Product name</Form.Label>
                                    <Form.Control
                                        type='text'
                                        value={pname}
                                        onChange={e => setpname(e.target.value)}
                                        required />
                                </Form.Group>
                                {errorMessage.pname && <div className="text-danger">{errorMessage.pname}</div>}
                                <Form.Group controlId='pID'>
                                    <Form.Label>Product description</Form.Label>
                                    <Form.Control
                                        type='text'
                                        value={pdescription}
                                        onChange={e => setpdescription(e.target.value)}
                                        required />
                                </Form.Group>
                                {errorMessage.pdescription && <div className="text-danger">{errorMessage.pdescription}</div>}
                                <Form.Group controlId='pID'>
                                    <Form.Label>Product price</Form.Label>
                                    <Form.Control
                                        type='number'
                                        min={0}
                                        value={pprice}
                                        onChange={e => setpprice(e.target.value)}
                                        required />
                                </Form.Group>
                                {errorMessage.pprice && <div className="text-danger">{errorMessage.pprice}</div>}
                            </Col>
                            <Col>
                                <Form.Group controlId='pID'>
                                    <Form.Label>Product quantity</Form.Label>
                                    <Form.Control
                                        type='number'
                                        min={0}
                                        value={pquantity}
                                        onChange={e => setpquantity(e.target.value)}
                                        required />
                                </Form.Group>
                                {errorMessage.pquantity && <div className="text-danger">{errorMessage.pquantity}</div>}
                                <Form.Group controlId='pID'>

                                    <Form.Label>Product image</Form.Label>
                                    <Form.Control
                                        type='file'
                                        accept='image/'
                                        width={400}
                                        onChange={onInputChange}
                                        required />
                                    {errorMessage.pimage && <div className="text-danger">{errorMessage.pimage}</div>}
                                    {imagePreview && (
                                        <div>
                                            <img src={imagePreview} alt='Preview' width={150} height={150} />
                                        </div>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>
                        <br />
                        <Button variant='primary' /*style={{ backgroundColor: '#55c2da ' }}*/ onClick={addProduct}>
                            Add Product for the world
                        </Button>
                    </Form>
                    <br />
                    <br />
                    <Products />
                    <br />
                    <br />
                </Layout>
            </div>
        </>
    )
}

export default AddProduct
