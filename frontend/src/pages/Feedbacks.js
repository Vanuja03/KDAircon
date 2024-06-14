import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import '../styles/feedback.css'
import { FaLinkedin, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';

const Feedbacks = () => {
    const [feedback, setFeedbacks] = useState([]);



    useEffect(() => {
        Axios.get("http://localhost:4000/api/feedbacks")
            .then((res) => {
                setFeedbacks(res.data);
            })
            .catch((err) => {
                alert(err.message);
            });
    }, []);

    const renderStarRating = (rating) => {
        const stars = [];
        for (let i = 0; i < rating; i++) {
            stars.push(<span key={i} className='stars'>★</span>)
        }
        return stars;
    }


    const handleLike = async (id) => {
        try {
            const response = await Axios.post(`http://localhost:4000/api/${id}/like`);
            if (response.data.success) {
                setFeedbacks(prevFeedbackList =>
                    prevFeedbackList.map(feedback =>
                        feedback._id == id ? { ...feedback, likes: feedback.likes + 1 } : feedback
                    )
                );
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handledisLike = async (id) => {
        try {
            const response = await Axios.post(`http://localhost:4000/api/${id}/dislike`);
            if (response.data.success) {
                setFeedbacks(prevFeedbackList =>
                    prevFeedbackList.map(feedback =>
                        feedback._id == id ? { ...feedback, dislikes: feedback.dislikes + 1 } : feedback
                    )
                );
            }
        } catch (error) {
            console.error(error);
        }
    }

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
    }

    return (
        <div>

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
                                <FaThumbsUp className='likes' onClick={() => handleLike(feedbacks._id)}>({feedbacks.likes || 0})</FaThumbsUp>
                                <FaThumbsDown className='dislikes' onClick={() => handledisLike(feedbacks._id)}>({feedbacks.dislikes || 0})</FaThumbsDown>
                            </div>
                        </Card.Body>
                        <Card.Text>{timeAgo(feedbacks.createdAt)}</Card.Text>
                    </Card>
                ))
            ) : (
                <span>No feedbacks yet</span>
            )}

        </div>
    )
}

export default Feedbacks
