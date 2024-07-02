import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Layout from '../components/Layout';
import { Alert, Button, Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaSadCry, FaSearch, FaShoppingCart } from 'react-icons/fa';
import PreferOrders from './PreferOrders';
import '../styles/addCarts.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import '../styles/searchinput.css';
import Aos from 'aos';
import 'aos/dist/aos.css';
import '../styles/topics.css';



const AddToCart = ({ submitted, data }) => {

  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userMail = user ? user.email : null;

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const getProducts = async () => {
    try {
      const response = await Axios.get('http://localhost:4000/api/products')
      console.log('Products', response.data);
      setProducts(response.data.allProducts);
    } catch (error) {
      console.error('Axios error', error);
    }
  }

  useEffect(() => {
    if (!submitted) {
      setQuantity(0);
    }
  }, [submitted]);

  useEffect(() => {
    if (data?.id && data.id !== 0) {
      setQuantity(data.quantity);
    }
  }, [data]);

  const addBooking = async (product) => {
    if (!quantity) {
      toast.error('Please enter a quantity before adding to cart');
      return;
    }
    try {
      if (!userMail) {
        navigate('/login');
        return;
      }

      const selectedQuantity = parseInt(quantity);
      if (isNaN(selectedQuantity) || selectedQuantity <= 0) {
        Swal.fire("Oops! Invalid quantity!");
        console.error('Invalid quantity');
      }

      const response = await Axios.post('http://localhost:4000/api/addBooking', {
        pname: product.pname,
        pprice: product.pprice,
        quantity: quantity,
        userMail: userMail,
      });

      console.log('Added to cart', response.data);
      await Swal.fire({
        title: "Your order is added to cart!",
        text: "Try out your cart!",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });

    } catch (error) {
      console.error('Error adding to cart', error);
    }
  }

  const handleqPress = (e) => {
    // Prevent the default behavior if a number key is pressed
    if (e.key === '+' || e.key === '-') {
      e.preventDefault();
    }
  }

  const filteredProducts = products.filter(product =>
    product.pname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (user) {
    return (
      <div>
        <Layout>
          <PreferOrders />
          <h1 className='topic' data-aos="fade-up">Our Products...</h1>
          <Form.Group className="search-container" style={{ marginRight: '4%' }} data-aos="fade-left">
            <FaSearch className='searchicon' />
            <input
              className='search-input'
              type='search'
              placeholder='Search by Product name'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </Form.Group>
          <Container data-aos="fade-up">
            <Row>
              {filteredProducts && filteredProducts.length > 0 ? (filteredProducts.map((product) => (
                <Col key={product._id} md={4} data-aos="fade-up">
                  <Card className='mb-4 cards cardimg' data-aos="fade-up">
                    <Card.Img
                      variant='top'
                      src={require(`../../src/images/${product.image}`)}
                      height={250} />
                    <Card.Body>
                      <Card.Title>{product.pname}</Card.Title>
                      <Card.Text>{product.pdescription}</Card.Text>
                      <Card.Text>Unit Price - {product.pprice}</Card.Text>
                      <Form.Group>
                        <Form.Label>Quantity <b>({product.pquantity}) available</b></Form.Label>
                        <Form.Control
                          type='number'
                          min={0}
                          name='quantity'
                          placeholder='Enter your amount'
                          onChange={(e) => setQuantity(e.target.value)}
                          onKeyDown={handleqPress}
                        />
                      </Form.Group>
                      <br />
                      <Button onClick={() => addBooking(product, quantity)} variant='primary'>Add to Cart</Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))) : (
                <h2>Sorry no products yet <FaSadCry /></h2>
              )}
            </Row>
          </Container>

        </Layout>
        <ToastContainer
          position="bottom-right"
          autoClose={3000} // Close the toast after 3 seconds
          hideProgressBar={false} // Show a progress bar
          closeOnClick={false} // Don't close the toast when clicked
        />
      </div>
    )
  }
  else {
    return (
      <div>
        <Layout>
          <h1 className='text-center'>Our Products</h1>
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
          <Container>
            <Row>
              {filteredProducts.map((product) => (
                <Col key={product._id} md={4}>
                  <Card className='mb-4'>
                    <Card.Img
                      variant='top'
                      src={require(`../images/${product.image}`)}
                      height={250} />
                    <Card.Body>
                      <Card.Title>{product.pname}</Card.Title>
                      <Card.Text>{product.pdescription}</Card.Text>
                      <Card.Text>Unit Price - {product.pprice}</Card.Text>
                      <Form.Group>
                        <Form.Label>Quantity <b>({product.pquantity}) available</b></Form.Label>
                        <Form.Control
                          type='number'
                          min={0}
                          name='quantity'
                          placeholder='Please login to order'
                        />
                      </Form.Group>
                      <br />
                      <Button>Please login first</Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </Layout>
      </div>
    )
  }
}

export default AddToCart;
