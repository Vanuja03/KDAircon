const Feedback = require('./feebackmodel');

const addFeedback = async (req, res) => {
    try {

        const { pname, feedback, email, name, rating } = req.body;

        const newFeedback = new Feedback({
            pname,
            feedback,
            email,
            name,
            rating
        });

        newFeedback.save();

        res.status(200).json({ message: 'Feedback added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const getAllFeedback = async (req, res) => {
    try {
        const feedbackList = await Feedback.find();
        res.status(200).json(feedbackList);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const deleteFeedback = async (req, res) => {
    const { _id } = req.body;
    try {
        await Feedback.findByIdAndDelete({ _id });
        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const updateFeedback = async (req, res) => {
    const feedbackId = req.params.id;
    const { feedback, email, name, rating } = req.body;

    try {
        const updatedFeedback = await Feedback.findByIdAndUpdate(feedbackId, { feedback, email, name, rating }, { new: true });
        if (!updatedFeedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.status(200).json({ message: 'Feedback updated successfully', updatedFeedback });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const likeFeedback = async (req, res) => {
    const feedbackId = req.params.id;
    try {
        const updatedFeedback = await Feedback.findByIdAndUpdate(feedbackId, { $inc: { likes: 1 } }, { new: true });
        res.status(200).json(updatedFeedback);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const dislikeFeedback = async (req, res) => {
    const feedbackId = req.params.id;
    try {
        const updatedFeedback = await Feedback.findByIdAndUpdate(feedbackId, { $inc: { dislikes: 1 } }, { new: true });
        res.status(200).json(updatedFeedback);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const replyToFeedback = async (req, res) => {
    const feedbackId = req.params.id;
    const { user, reply } = req.body;
    try {
        const updatedFeedback = await Feedback.findByIdAndUpdate(feedbackId, { $push: { replies: { user, reply } } }, { new: true });
        res.status(200).json(updatedFeedback);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getCustomerFeedback = async (req, res) => {
    try {
        const feedbackList = await Feedback.find({}, 'name feedback rating likes dislikes');
        res.status(200).json(feedbackList);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const storeFeedbackInquiry = async (req, res) => {
    try {
        // Logic to store customer inquiry
        res.status(201).json({ message: 'Customer inquiry stored successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    addFeedback,
    getAllFeedback,
    deleteFeedback,
    updateFeedback,
    likeFeedback,
    dislikeFeedback,
    replyToFeedback,
    getCustomerFeedback,
    storeFeedbackInquiry
}

