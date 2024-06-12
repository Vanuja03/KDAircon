import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import Axios from 'axios';
import Swal from 'sweetalert2';

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

  const unitPrices = {
    'Condenser': {
      '9000 Btu Condenser Coil (18x24) Single Row': 100,
      '9000 Btu Condenser Coil (20x16) Single Row , S/T': 110,
      '9000 Btu Condenser Coil (18x27) Single Row': 120,
      '12000 Btu Condenser Coil (20x28) Single Row': 130,
      '12001 Btu Condenser Coil (20x24) Single Row': 140,
      '12000 Btu Condenser Coil (20x30) Single Row': 150,
      '12000 Btu Condenser Coil (20x30) 1 1/2  Row': 160,
      '12001 Btu Condenser Coil (20x32) Single  Row': 170,
      '12000 Btu Condenser Coil (23x27) Single Row': 180,
      '12000 Btu Condenser Coil (18x27) 1 1/2 Row(LG Inverter)(no-01)': 190,
      '12000 Btu Condenser Coil (18x27) Double Row(LG Inverter)(no-01)': 200,
      '12000 Btu Condenser Coil (24x24) Single Row Streight(Pansonic Non Inverter)': 210,
      '18000 Btu Condenser Coil (19x32) S/R (Panasonic Inverter)': 220,
      '10001 Btu Condenser Coil (19x24) D/R (Panasonic Inverter)': 230,
      '13000 Btu Condenser Coil (19x24) 1 1/2 Row (Panasonic Inverter)': 240,
      '18000 Btu Condenser Coil (20x30) Double Row': 250,
      '18000 Btu Condenser Coil (20x32) Double Row (LG)': 260,
      '18000 Btu Condenser Coil (20x32) 1 1/2 Row (LG)': 270,
      '18000 Btu Condenser Coil (24x24) 1 1/2 Row Streight(Pansonic Non Inverter)': 280,
      '18000 Btu Condenser Coil (24x32) Single Row': 290,
      '18000 Btu Condenser Coil (23x33) 1 1/2  Row (Pansonic Inverter)': 300,
      '18000 Btu Condenser Coil (22x32) Single Row': 310,
      '18000 Btu Condenser Coil (20x28) D/R Row-(Pansonic Inverter)': 320,
      '24000 Btu Condenser Coil (26x34) Single Row-(Panasonic)': 330,
      '24000 Btu Condenser Coil (24x34) Single Row': 340,
      '24000 Btu Condenser Coil (22x32) Double Row': 350,
      '24000 Btu Condenser Coil (24x32) Double Row ': 360,
      '24000 Btu Condenser Coil (24x34) Double Row (LG)': 370,
      '24000 Btu Condenser Coil (26x36) Single Row': 380,
      '24000 Btu Condenser Coil (26x36) Double Row': 390,
      '24000 Btu Condenser Coil (26x34) Double Row': 400,
      '24000 Btu Condenser Coil (26x26) 1 1/2 Row Streight (Pansonic Inverter)': 410,
      '24000 Btu Condenser Coil (26x26) Double Row Streight (Pansonic Inverter)': 420,
      '24000 Btu Condenser Coil (26x26) Single Row Streight': 430,
      '24000 Btu Condenser Coil (24x34) 1 1/2 Row': 440,
      '24000 Btu Condenser Coil (24x34) 1 1/2 Row-Media': 450,
      '24000 Btu Condenser Coil (26x32) Double Row-Media': 460,
      '24000 Btu Condenser Coil (26x32) Single Row-Media': 470,
      '24000 Btu Condenser Coil (28x34) 1 1/2 Row': 480,
      '36000 Btu Condenser Coil (36x36) Single Row': 490,
      '36001 Btu Condenser Coil (36x36) Double Row': 500,
      '36000 Btu Condenser Coil (40x36) Single Row': 510,
      '36000 Btu Condenser Coil (30x34) Double Row': 520,
      '36000 Btu Condenser Coil (30x41) Double Row-Media': 530,
      '36000 Btu Condenser Coil (30x41) 1 1/2 Row-Media': 540,
      '36001 Btu Condenser Coil (30x33) Double Row': 550,
      '36000 Btu Condenser Coil (32x32) Double Row': 560,
      '36000 Btu Condenser Coil (32x32) 1 1/2 Row': 570,
      '48000 Btu Condenser Coil (44x32) Single Row': 580,
      '48000 Btu Condenser Coil (44x34) Single Row': 590,
      '48000 Btu Condenser Coil (44x34) Double Row': 600,
      '48000 Btu Condenser Coil (44x34) 1 1/2 Row': 610,
      '48000 Btu Condenser Coil (48x34) Double Row': 620,
      '48000 Btu Condenser Coil (48x34) 1 1/2 Row': 630,
      '48000 Btu Condenser Coil (46x34) Double Row': 640,
      '48000 Btu Condenser Coil (48x34) Single Row': 650,
      '48000 Btu Condenser Coil (56x34)Double Row': 660,
    }  // Define unit prices for other products
  };

  useEffect(() => {
    // Update unit price when size changes
    if (pname && psize) {
      setUnitPrice(unitPrices[pname][psize]);
    }
  }, [pname, psize]);

  const addPrefer = async () => {

    if (!quantity) {
      setErrorMessage('Your selected quantity 0 ! ');
      return;
    }
    if (!psize) {
      setErrorMessage('Please select a size');
      return;
    }
    const userMail = user ? user.email : null;
    try {
      const response = await Axios.post('http://localhost:4000/api/addprefer', {
        pname,
        psize: psize,
        pGasType: pGasType,
        pTubeSize: pTubeSize,
        quantity: quantity,
        userMail: userMail,
      });
      console.log('Added to cart', response.data);
      await Swal.fire({
        title: "Your Custormized order is added to cart!",
        text: "Try out your cart!",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // const filteredproductData = p.filter(clin => {
  //   return clin.ff.toLowerCase().includes(searchQuery.toLowerCase());
  // });

  return (
    <div>
      <br />
      <br />
      <Container>
        <h1 className='text-center'>Products of your own</h1>
        <Row>
          {errorMessage && <Alert variant='danger'>{errorMessage}</Alert>}
          <Col md={4}>
            <Card className='mb-4 cards'>
              <Card.Img
                variant='top'
                height={250}
                src={require(`../images2/Condenser1.jpg`)} />
              <Card.Body>
                <Card.Title>Condenser</Card.Title>
                <Card.Text>Condenser test</Card.Text>
                <Card.Text>Unit Price : {unitPrice}</Card.Text>
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
                </Form.Group>
                <Form.Group>
                  <Form.Label>Tube Size</Form.Label>
                  <Form.Control as='select' size='sm' onChange={(e) => setpTube(e.target.value)} custom required>
                    <option disabled>Select tube size</option>
                    <option>9mm</option>
                    <option>7mm</option>
                  </Form.Control>
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
                </Form.Group>
                <br />
                <Button onClick={addPrefer} variant='primary'>Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className='mb-4 cards'>
              <Card.Img
                variant='top'
                height={250}
                src={require(`../images2/Condenser1.jpg`)} />
              <Card.Body>
                <Card.Title >Fiber Glass Outdoor Casing</Card.Title>
                <Card.Text>kkkkkkkkk</Card.Text>
                <Form.Group>
                  <Form.Label>Select your size</Form.Label>
                  <Form.Control as='select' size='sm' onChange={(e) => {
                    setpsize(e.target.value);
                    setpname('Fiber Glass Outdoor Casing');
                  }} custom >
                    <option disabled>Select size</option>
                    <option>9000 Btu</option>
                    <option>12000 Btu</option>
                    <option>18000 Btu</option>
                    <option>24000 Btu</option>
                    <option>36000 Btu</option>
                    <option>48000 Btu</option>
                  </Form.Control>
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
                </Form.Group>
                <br />
                <Button onClick={addPrefer} variant='primary'>Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className='mb-4 cards'>
              <Card.Img
                variant='top'
                height={250}
                src={require(`../images2/Condenser1.jpg`)} />
              <Card.Body>
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
                </Form.Group>
                <Form.Group>
                  <Form.Label>Gas type</Form.Label>
                  <Form.Control as='select' size='sm' onChange={(e) => setpGas(e.target.value)} custom required>
                    <option disabled>Gas type</option>
                    <option>R 22</option>
                    <option>R 410</option>
                  </Form.Control>
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
