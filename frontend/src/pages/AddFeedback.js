import Axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Button, Card, Form } from 'react-bootstrap';
import '../styles/addfeedback.css';
import * as yup from 'yup';

const AddFeedback = ({ onFeedbackAdded }) => {
    const [pname, setPname] = useState('');
    const [feedback, setFeedback] = useState('');
    const [name, setName] = useState('');
    const [rating, setRating] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    const user = JSON.parse(localStorage.getItem('user'));
    const userMail = user ? user.email : null;

    const validateSchema = yup.object().shape({
        pname: yup.string().required('Product name is required'),
        feedback: yup.string().required('Feedback is required'),
        name: yup.string().required('Name is required'),
        rating: yup.number().required('Please give a rating to us')
    })

    const addFeedback = async (e) => {
        e.preventDefault();
        try {
            await validateSchema.validate({ pname, feedback, name, rating }, { abortEarly: false });
            const response = await Axios.post('http://localhost:4000/api/addfeedback', {
                pname,
                feedback,
                userMail: userMail,
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
            setName('');
            setRating(0);

            if (onFeedbackAdded) onFeedbackAdded();
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const errors = {};
                error.inner.forEach(err => {
                    errors[err.path] = err.message;
                });
                setErrorMessage(errors);
            } else {
                console.error('Error', error);
            }
        }
    };

    const handleRating = (newRating) => {
        setRating(newRating);
    };

    return (
        <div>
            <Card>
                <Card.Body>
                    <Card.Title style={{ fontSize: '1.3em' }}>Provide your valuable feedback</Card.Title>
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
                            {errorMessage.pname && <div className="text-danger">{errorMessage.pname}</div>}
                        </Form.Group>
                        <br />
                        <Form.Group controlId="formName">
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                            />
                            {errorMessage.name && <div className="text-danger">{errorMessage.name}</div>}
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
                            {errorMessage.feedback && <div className="text-danger">{errorMessage.feedback}</div>}
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
                            {errorMessage.rating && <div className="text-danger">{errorMessage.rating}</div>}
                        </Form.Group>
                        <br />
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

const Star = ({ selected = false, onClick }) => (
    <span className={selected ? 'star-selected' : 'star'} onClick={onClick} style={{ cursor: 'pointer', fontSize: '1.5rem' }}>
        ★
    </span>
);

export default AddFeedback;
