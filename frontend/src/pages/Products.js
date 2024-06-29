import React, { useEffect, useState } from 'react';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent } from '@mui/material';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaEdit, FaSearch, FaTrash } from 'react-icons/fa';
import { Col, Form, Row } from 'react-bootstrap';
import '../styles/searchinput.css'

const Products = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const [updateProduct, setUpdateProduct] = useState({});
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const getProducts = async () => {
        try {
            const response = await Axios.get('http://localhost:4000/api/products');
            setProducts(response.data.allProducts);
        } catch (error) {
            console.error("Axios error: ", error);
        }
    }

    useEffect(() => {
        getProducts();
    }, []);

    const openUpdatePopup = (product) => {
        setUpdateProduct(product);
        setOpen(true);
    }

    const closeUpdatePopup = () => {
        setOpen(false);
        setUpdateProduct({});
    }

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdateProduct({
            ...updateProduct,
            [name]: value,
        });
    }

    const updateProducts = async (pid, pname, pdescription, pprice, pquantity) => {
        try {
            const response = await Axios.post('http://localhost:4000/api/updateProduct', {
                pid,
                pname,
                pdescription,
                pprice,
                pquantity,
            });
            console.log('Update product response : ', response.data);
            return response.data;
        } catch (error) {
            console.error('Error updating product axios error : ', error);
        }
    };

    const handleUpdateSave = async () => {
        try {
            const response = await Axios.post('http://localhost:4000/api/updateProduct', updateProduct);
            console.log('Update product response: ', response.data);
            getProducts();
            closeUpdatePopup();
        } catch (error) {
            console.error('Error updating product axios error: ', error);
        }
    }

    const confirmUpdate = () => {

        setOpen(false);
        Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                handleUpdateSave();
                Swal.fire("Saved!", "", "success");

            } else if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info");
                setOpen(true);
            }
        });
    }

    const deleteProduct = (pid) => {
        Axios.post('http://localhost:4000/api/deleteProduct', { pid })
            .then(() => {
                getProducts();
                window.onmessage('Successfully deleted ', pid);
            })
            .catch(error => {
                console.error("Axios error: ", error);
            });
    };

    const confirmDelete = (pid) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                deleteProduct(pid);
                swalWithBootstrapButtons.fire({
                    title: "Deleted!",
                    text: "Your product " + pid + " has been deleted.",
                    icon: "success"
                });
            }
        });
    }
    const filteredProducts = products.filter(product =>
        product.pname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
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
                <Table sx={{ '&:last-child td, &:last-child th': { border: 1 } }}>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Description</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Unit Price</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Quantity</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Image</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProducts && filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <TableRow key={product._id} >
                                    <TableCell>{product.pid}</TableCell>
                                    <TableCell>{product.pname}</TableCell>
                                    <TableCell>{product.pdescription}</TableCell>
                                    <TableCell>{product.pprice}</TableCell>
                                    <TableCell>{product.pquantity}</TableCell>
                                    <TableCell>
                                        <img
                                            src={require(`../images/${product.image}`)}
                                            alt={`Product ${product.pid}`}
                                            width="150px"
                                            height="100px"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={() => openUpdatePopup(product)}><FaEdit /></Button>
                                        <Button onClick={() => confirmDelete(product.pid)}><FaTrash /></Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7}>You have no products added yet!!</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={closeUpdatePopup}>
                <DialogTitle>Update Product</DialogTitle>
                <DialogContent>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId='pID'>
                                    <Form.Label>Product ID (<b>please do not enter same id twice look your added products in Below </b>)</Form.Label>
                                    <Form.Control
                                        type='number'
                                        min={0}
                                        value={updateProduct.pid}
                                        name='pid'
                                        readOnly
                                        required />
                                </Form.Group>
                                <Form.Group controlId='pname'>
                                    <Form.Label>Product name</Form.Label>
                                    <Form.Control
                                        type='text'
                                        value={updateProduct.pname}
                                        name='pname'
                                        onChange={handleUpdateChange}
                                        required />
                                </Form.Group>
                                <Form.Group controlId='pdesc'>
                                    <Form.Label>Product description</Form.Label>
                                    <Form.Control
                                        type='text'
                                        value={updateProduct.pdescription}
                                        name='pdescription'
                                        onChange={handleUpdateChange}
                                        required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId='pprice'>
                                    <Form.Label>Product price</Form.Label>
                                    <Form.Control
                                        type='number'
                                        min={0}
                                        value={updateProduct.pprice}
                                        name='pprice'
                                        onChange={handleUpdateChange}
                                        required />
                                </Form.Group>
                                <Form.Group controlId='pquantity'>
                                    <Form.Label>Product quantity</Form.Label>
                                    <Form.Control
                                        type='number'
                                        min={0}
                                        value={updateProduct.pquantity}
                                        name='pquantity'
                                        onChange={handleUpdateChange}
                                        required />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Product image</Form.Label>

                                </Form.Group>
                            </Col>
                        </Row>
                        <br />
                        <Button onClick={confirmUpdate}>
                            Save changes
                        </Button>
                        <Button onClick={closeUpdatePopup}>
                            Cancel
                        </Button>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Products;
