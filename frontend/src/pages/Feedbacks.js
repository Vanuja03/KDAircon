import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import '../styles/feedback.css';
import { FaPlus, FaThumbsDown, FaThumbsUp, FaTimes, FaTrash } from 'react-icons/fa';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import AddFeedBack from './AddFeedback';
import Swal from 'sweetalert2';

const Feedbacks = () => {
    const [feedback, setFeedbacks] = useState([]);
    const [openaddf, setopenadd] = useState(false);
    const [openyf, setopenyf] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));
    const userMail = user ? user.email : null;

    useEffect(() => {
        getfeedbacks();
    }, []);

    const getfeedbacks = () => {
        Axios.get("http://localhost:4000/api/feedbacks")
            .then((res) => {
                setFeedbacks(res.data);
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const renderStarRating = (rating) => {
        const stars = [];
        for (let i = 0; i < rating; i++) {
            stars.push(<span key={i} className='stars'>★</span>);
        }
        return stars;
    };

    const handleLike = async (id) => {
        const likedFeedbacks = JSON.parse(localStorage.getItem('likedFeedbacks')) || [];

        if (likedFeedbacks.includes(id)) return;  // User already liked this feedback

        try {
            const response = await Axios.post(`http://localhost:4000/api/${id}/like`);
            if (response.data.success) {
                setFeedbacks(prevFeedbackList =>
                    prevFeedbackList.map(feedback =>
                        feedback._id === id ? { ...feedback, likes: feedback.likes + 1 } : feedback
                    )
                );
                likedFeedbacks.push(id);
                localStorage.setItem('likedFeedbacks', JSON.stringify(likedFeedbacks));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handledisLike = async (id) => {
        const dislikedFeedbacks = JSON.parse(localStorage.getItem('dislikedFeedbacks')) || [];

        if (dislikedFeedbacks.includes(id)) return;  // User already disliked this feedback

        try {
            const response = await Axios.post(`http://localhost:4000/api/${id}/dislike`);
            if (response.data.success) {
                setFeedbacks(prevFeedbackList =>
                    prevFeedbackList.map(feedback =>
                        feedback._id === id ? { ...feedback, dislikes: feedback.dislikes + 1 } : feedback
                    )
                );
                dislikedFeedbacks.push(id);
                localStorage.setItem('dislikedFeedbacks', JSON.stringify(dislikedFeedbacks));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteFeedback = (_id) => {
        Axios.post(`http://localhost:4000/api/deleteFeedback`, { _id: _id })
            .then(() => {
                setFeedbacks((prevFeedback) => prevFeedback.filter((feedback) => feedback._id !== _id));
                console.log('Deleted successfully');
                setopenyf(false);
                getfeedbacks();
                Swal.fire({
                    title: "Success!",
                    text: "Feedback was deleted successfully!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
            })
            .catch(error => {
                console.error('Axios error: ', error);
            });
    };

    const timeAgo = (date) => {
        const now = new Date();
        const createdDate = new Date(date);
        const diff = now - createdDate;

        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

        const days = Math.floor(hours / 24);
        if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;

        const months = Math.floor(days / 30);
        if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;

        const years = Math.floor(months / 12);
        return `${years} year${years === 1 ? '' : 's'} ago`;
    };

    const handleFeedbackAdded = () => {
        getfeedbacks();
        setopenadd(false);
    };

    const yourfeedbacks = feedback.filter(feedbacks => feedbacks.userMail === userMail);

    return (
        <div>
            <div>
                <Button onClick={() => setopenadd(true)}><FaPlus /></Button>
                <Button onClick={() => setopenyf(true)}>Your Feedbacks</Button>
            </div>
            {feedback && feedback.length > 0 ? (
                feedback.map((feedbacks) => (
                    <Card key={feedbacks._id}>
                        <Card.Title className='disflex'>{feedbacks.name}
                            <div className='starrating'>
                                {feedbacks.pname} -
                                {renderStarRating(feedbacks.rating)}
                            </div>
                        </Card.Title>
                        <Card.Body className='flex2dis'>{feedbacks.feedback}
                            <div className='actionbuttons'>
                                <FaThumbsUp
                                    className={`likes ${JSON.parse(localStorage.getItem('likedFeedbacks'))?.includes(feedbacks._id) ? 'liked' : ''}`}
                                    onClick={() => handleLike(feedbacks._id)}
                                >({feedbacks.likes || 0})</FaThumbsUp>
                                <FaThumbsDown
                                    className={`dislikes ${JSON.parse(localStorage.getItem('dislikedFeedbacks'))?.includes(feedbacks._id) ? 'disliked' : ''}`}
                                    onClick={() => handledisLike(feedbacks._id)}
                                >({feedbacks.dislikes || 0})</FaThumbsDown>
                            </div>
                        </Card.Body>
                        <Card.Text>{timeAgo(feedbacks.createdAt)}</Card.Text>
                    </Card>
                ))
            ) : (
                <span>No feedbacks yet</span>
            )}

            <Dialog open={openaddf}>
                <DialogTitle>Add your feedback <Button onClick={() => setopenadd(false)}><FaTimes /></Button></DialogTitle>
                <DialogContent>
                    <AddFeedBack onFeedbackAdded={handleFeedbackAdded} />
                </DialogContent>
            </Dialog>

            <Dialog open={openyf} maxWidth='xl'>
                <DialogTitle>Your feedbacks <Button onClick={() => setopenyf(false)}><FaTimes /></Button></DialogTitle>
                <DialogContent>
                    {yourfeedbacks && yourfeedbacks.length > 0 ? (
                        yourfeedbacks.map((feedbacks) => (
                            <Card key={feedbacks._id}>
                                <Card.Title className='disflex'>{feedbacks.name}
                                    <div className='starrating'>
                                        {feedbacks.pname} -
                                        {renderStarRating(feedbacks.rating)}
                                    </div>
                                    <Button onClick={() => deleteFeedback(feedbacks._id)}><FaTrash /></Button>
                                </Card.Title>
                                <Card.Body className='flex2dis'>{feedbacks.feedback}
                                    <div className='actionbuttons'>
                                        <FaThumbsUp
                                            className={`likes ${JSON.parse(localStorage.getItem('likedFeedbacks'))?.includes(feedbacks._id) ? 'liked' : ''}`}
                                            onClick={() => handleLike(feedbacks._id)}
                                        >({feedbacks.likes || 0})</FaThumbsUp>
                                        <FaThumbsDown
                                            className={`dislikes ${JSON.parse(localStorage.getItem('dislikedFeedbacks'))?.includes(feedbacks._id) ? 'disliked' : ''}`}
                                            onClick={() => handledisLike(feedbacks._id)}
                                        >({feedbacks.dislikes || 0})</FaThumbsDown>
                                    </div>
                                </Card.Body>
                                <Card.Text>{timeAgo(feedbacks.createdAt)}</Card.Text>
                            </Card>
                        ))
                    ) : (
                        <span>You have no feedbacks yet</span>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Feedbacks;
