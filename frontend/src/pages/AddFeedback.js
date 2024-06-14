import Axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Layout from '../components/Layout';
import { Button, Card, Form } from 'react-bootstrap';
import '../styles/addfeedback.css';
import Feedbacks from './Feedbacks';

const AddFeedback = () => {
    const [pname, setPname] = useState('');
    const [feedback, setFeedback] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [rating, setRating] = useState(0);

    const navigate = useNavigate();

    const addFeedback = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios.post('http://localhost:4000/api/addfeedback', {
                pname,
                feedback,
                email,
                name,
                rating
            });

            console.log("Feedback added successfully", response.data);
            Swal.fire({
                title: "Success!",
                text: "Feedback was added successfully!",
                icon: "success",
                showConfirmButton: false,
                timer: 2000
            });

            setPname('');
            setFeedback('');
            setEmail('');
            setName('');
            setRating(0);
        } catch (error) {
            console.error('Error', error);
        }
    };

    const handleRating = (newRating) => {
        setRating(newRating);
    };

    return (
        <div>
            <Layout>
                <Card>
                    <Card.Body>
                        <Card.Title>Provide your valuable feedback</Card.Title>
                        <Form onSubmit={addFeedback}>
                            <Form.Group controlId="formProductName">
                                <Form.Label>Select Product</Form.Label>
                                <Form.Control as="select" value={pname} onChange={(e) => setPname(e.target.value)}>
                                    <option disabled defaultChecked>Select product</option>
                                    <option>Condenser</option>
                                    <option>Fiber Glass outdoor casing</option>
                                    <option>Compressor</option>
                                    <option>Outdoor unit</option>
                                    <option>Indoor unit</option>
                                </Form.Control>
                            </Form.Group>
                            <br />
                            <Form.Group controlId="formFeedback">
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Enter your feedback"
                                />
                            </Form.Group>
                            <br />
                            <Form.Group controlId="formName">
                                <Form.Control
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                />
                            </Form.Group>
                            <br />
                            <Form.Group controlId="formEmail">
                                <Form.Control
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                />
                            </Form.Group>
                            <br />
                            <Form.Group controlId="formRating">
                                <Form.Label>Enter rating</Form.Label>
                                <div>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            selected={star <= rating}
                                            onClick={() => handleRating(star)}
                                        />
                                    ))}
                                </div>
                            </Form.Group>
                            <br />
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
                <Feedbacks />
            </Layout>
        </div>
    );
};

const Star = ({ selected = false, onClick }) => (
    <span className={selected ? 'star-selected' : 'star'} onClick={onClick} style={{ cursor: 'pointer', fontSize: '1.5rem' }}>
        ★
    </span>
);

export default AddFeedback;
