import React, { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import Axios from 'axios';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import Aos from 'aos';
import 'aos/dist/aos.css';
import '../styles/topics.css';
import { FaCheckCircle } from 'react-icons/fa';

const PreferOrders = () => {

  const [pname, setpname] = useState('');
  const [psize, setpsize] = useState('');
  const [pTubeSize, setpTube] = useState('');
  const [pGasType, setpGas] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [unitFPrice, setFUnitPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const [errors, setErrors] = useState({});

  const schema = Yup.object().shape({
    pname: Yup.string().required('Product name is required'),
    psize: Yup.string().required('Size is required'),
    quantity: Yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1'),
    pTubeSize: pname === 'Condenser' ? Yup.string().required('Tube size is required') : Yup.string(),
    pGasType: pname === 'Brand new outdoor unit air conditioner' ? Yup.string().required('Gas type is required') : Yup.string()
  });

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const addPrefer = async () => {

    try {
      await schema.validate({ pname, psize, quantity, pTubeSize, pGasType }, { abortEarly: false });
      setErrors({});

      const userMail = user ? user.email : null;
      const response = await Axios.post('http://localhost:4000/api/addprefer', {
        pname,
        psize,
        pGasType,
        pTubeSize,
        quantity,
        userMail
      });

      console.log('Added to cart', response.data);
      await Swal.fire({
        title: "Your customized order is added to cart!",
        text: "Try out your cart!",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const formattedErrors = {};
        error.inner.forEach((err) => {
          formattedErrors[err.path] = err.message;
        });
        setErrors(formattedErrors);
      } else {
        console.error('Error adding to cart:', error);
      }
    }
  };

  return (
    <div>
      <br />
      <br />
      <Container>
        <h1 className='topic' data-aos="fade-left">Customized products</h1>
        <Row>
          {errorMessage && <Alert variant='danger'>{errorMessage}</Alert>}
          <Col md={4}>
            <Card className='mb-4 cards' data-aos="fade-up" style={{ minHeight: '650px' }}>
              <Card.Img
                variant='top'
                height={250}
                src={require(`../images2/Condenser1.jpg`)} />
              <Card.Body>
                <p style={{ color: 'green', textAlign: 'end', fontWeight: 'bold' }}><FaCheckCircle /> Vertified product</p>
                <Card.Title>Condenser</Card.Title>
                <Card.Text>Condenser test</Card.Text>
                <Form.Group>
                  <Form.Label>Select your size</Form.Label>
                  <Form.Control as='select' size='sm' custom onChange={(e) => {
                    setpsize(e.target.value);
                    setpname('Condenser');
                  }} >
                    <input placeholder="Search type" type='text' /*value={searchQuery} onChange={e => setSearchQuery(e.target.value)} */ />
                    <option disabled>Select size</option>
                    <option>9000 Btu Condenser Coil (18x24) Single Row</option>
                    <option>9000 Btu Condenser Coil (20x16) Single Row , S/T</option>
                    <option>9000 Btu Condenser Coil (18x27) Single Row</option>
                    <option>12000 Btu Condenser Coil (20x28) Single Row</option>
                    <option>12001 Btu Condenser Coil (20x24) Single Row</option>
                    <option>12000 Btu Condenser Coil (20x30) Single Row</option>
                    <option>12000 Btu Condenser Coil (20x30) 1 1/2  Row</option>
                    <option>12001 Btu Condenser Coil (20x32) Single  Row</option>
                    <option>12000 Btu Condenser Coil (23x27) Single Row</option>
                    <option>12000 Btu Condenser Coil (18x27) 1 1/2 Row(LG Inverter)(no-01)</option>
                    <option>12000 Btu Condenser Coil (18x27) Double Row(LG Inverter)(no-01)</option>
                    <option>12000 Btu Condenser Coil (24x24) Single Row Streight(Pansonic Non Inverter)</option>
                    <option>18000 Btu Condenser Coil (19x32) S/R (Panasonic Inverter)</option>
                    <option>10001 Btu Condenser Coil (19x24) D/R (Panasonic Inverter)</option>
                    <option>13000 Btu Condenser Coil (19x24) 1 1/2 Row (Panasonic Inverter)</option>
                    <option>18000 Btu Condenser Coil (20x30) Double Row</option>
                    <option>18000 Btu Condenser Coil (20x32) Double Row (LG)</option>
                    <option>18000 Btu Condenser Coil (20x32) 1 1/2 Row (LG)</option>
                    <option>18000 Btu Condenser Coil (24x24) 1 1/2 Row Streight(Pansonic Non Inverter)</option>
                    <option>18000 Btu Condenser Coil (24x32) Single Row</option>
                    <option>18000 Btu Condenser Coil (23x33) 1 1/2  Row (Pansonic Inverter)</option>
                    <option>18000 Btu Condenser Coil (22x32) Single Row</option>
                    <option>18000 Btu Condenser Coil (20x28) D/R Row-(Pansonic Inverter)</option>
                    <option>24000 Btu Condenser Coil (26x34) Single Row-(Panasonic)</option>
                    <option>24000 Btu Condenser Coil (24x34) Single Row</option>
                    <option>24000 Btu Condenser Coil (22x32) Double Row</option>
                    <option>24000 Btu Condenser Coil (24x32) Double Row </option>
                    <option>24000 Btu Condenser Coil (24x34) Double Row (LG)</option>
                    <option>24000 Btu Condenser Coil (26x36) Single Row</option>
                    <option>24000 Btu Condenser Coil (26x36) Double Row</option>
                    <option>24000 Btu Condenser Coil (26x34) Double Row</option>
                    <option>24000 Btu Condenser Coil (26x26) 1 1/2 Row Streight (Pansonic Inverter)</option>
                    <option>24000 Btu Condenser Coil (26x26) Double Row Streight (Pansonic Inverter)</option>
                    <option>24000 Btu Condenser Coil (26x26) Single Row Streight</option>
                    <option>24000 Btu Condenser Coil (24x34) 1 1/2 Row</option>
                    <option>24000 Btu Condenser Coil (24x34) 1 1/2 Row-Media</option>
                    <option>24000 Btu Condenser Coil (26x32) Double Row-Media</option>
                    <option>24000 Btu Condenser Coil (26x32) Single Row-Media</option>
                    <option>24000 Btu Condenser Coil (28x34) 1 1/2 Row</option>
                    <option>36000 Btu Condenser Coil (36x36) Single Row</option>
                    <option>36001 Btu Condenser Coil (36x36) Double Row</option>
                    <option>36000 Btu Condenser Coil (40x36) Single Row</option>
                    <option>36000 Btu Condenser Coil (30x34) Double Row</option>
                    <option>36000 Btu Condenser Coil (30x41) Double Row-Media</option>
                    <option>36000 Btu Condenser Coil (30x41) 1 1/2 Row-Media</option>
                    <option>36001 Btu Condenser Coil (30x33) Double Row</option>
                    <option>36000 Btu Condenser Coil (32x32) Double Row</option>
                    <option>36000 Btu Condenser Coil (32x32) 1 1/2 Row</option>
                    <option>48000 Btu Condenser Coil (44x32) Single Row</option>
                    <option>48000 Btu Condenser Coil (44x34) Single Row</option>
                    <option>48000 Btu Condenser Coil (44x34) Double Row</option>
                    <option>48000 Btu Condenser Coil (44x34) 1 1/2 Row</option>
                    <option>48000 Btu Condenser Coil (48x34) Double Row</option>
                    <option>48000 Btu Condenser Coil (48x34) 1 1/2 Row</option>
                    <option>48000 Btu Condenser Coil (46x34) Double Row</option>
                    <option>48000 Btu Condenser Coil (48x34) Single Row</option>
                    <option>48000 Btu Condenser Coil (56x34)Double Row</option>
                  </Form.Control>
                  {errors.psize && <p className="text-danger">{errors.psize}</p>}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Tube Size</Form.Label>
                  <Form.Control as='select' size='sm' onChange={(e) => setpTube(e.target.value)} custom required>
                    <option disabled>Select tube size</option>
                    <option>9mm</option>
                    <option>7mm</option>
                  </Form.Control>
                  {errors.pTubeSize && <p className="text-danger">{errors.pTubeSize}</p>}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type='number'
                    min={0}
                    name='quantity'
                    placeholder='Enter your amount'
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  {errors.quantity && <p className="text-danger">{errors.quantity}</p>}
                </Form.Group>
                <br />
                <Button onClick={addPrefer} variant='primary'>Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className='mb-4 cards' data-aos="fade-up" style={{ minHeight: '650px' }}>
              <Card.Img
                variant='top'
                height={250}
                src={require(`../images2/Condenser1.jpg`)} />
              <Card.Body>
                <p style={{ color: 'green', textAlign: 'end', fontWeight: 'bold' }}><FaCheckCircle /> Vertified product</p>
                <Card.Title >Fiber Glass Outdoor Casing</Card.Title>
                <Card.Text>kkkkkkkkk</Card.Text>
                <Form.Group>
                  <Form.Label>Select your size</Form.Label>
                  <Form.Control as='select' size='sm' onChange={(e) => {
                    setpsize(e.target.value);
                    setpname('Fiber Glass Outdoor Casing');
                  }} custom
                    placeholder='Select your size' >
                    <option>9000 Btu</option>
                    <option>12000 Btu</option>
                    <option>18000 Btu</option>
                    <option>24000 Btu</option>
                    <option>36000 Btu</option>
                    <option>48000 Btu</option>
                  </Form.Control>
                  {errors.psize && <p className="text-danger">{errors.psize}</p>}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type='number'
                    min={0}
                    name='quantity'
                    placeholder='Enter your amount'
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  {errors.quantity && <p className="text-danger">{errors.quantity}</p>}
                </Form.Group>
                <br />
                <Button onClick={addPrefer} variant='primary'>Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className='mb-4 cards' data-aos="fade-up" style={{ minHeight: '650px' }}>
              <Card.Img
                variant='top'
                height={250}
                src={require(`../images2/Condenser1.jpg`)} />
              <Card.Body>
                <p style={{ color: 'green', textAlign: 'end', fontWeight: 'bold' }}><FaCheckCircle /> Vertified product</p>
                <Card.Title >Brand new outdoor unit air conditioner</Card.Title>
                <Card.Text>kkkkkkkkk</Card.Text>
                <Form.Group>
                  <Form.Label>Select your size</Form.Label>
                  <Form.Control as='select' size='sm' onChange={(e) => {
                    setpsize(e.target.value);
                    setpname('Brand new outdoor unit air conditioner');
                  }} custom>
                    <option disabled >Select size</option>
                    <option>9000 Btu</option>
                    <option>12000 Btu</option>
                    <option>18000 Btu</option>
                    <option>24000 Btu</option>
                    <option>36000 Btu</option>
                    <option>48000 Btu</option>
                  </Form.Control>
                  {errors.psize && <p className="text-danger">{errors.psize}</p>}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Gas type</Form.Label>
                  <Form.Control as='select' size='sm' onChange={(e) => setpGas(e.target.value)} custom required>
                    <option disabled>Gas type</option>
                    <option>R 22</option>
                    <option>R 410</option>
                  </Form.Control>
                  {errors.pGasType && <p className="text-danger">{errors.pGasType}</p>}
                </Form.Group>
                <Form.Group>
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type='number'
                    min={0}
                    name='quantity'
                    placeholder='Enter your amount'
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  {errors.quantity && <p className="text-danger">{errors.quantity}</p>}
                </Form.Group>
                <br />
                <Button onClick={addPrefer} variant='primary'>Add to Cart</Button>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default PreferOrders;
