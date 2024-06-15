const express = require('express');
const routerF = express.Router();
const FeedbackController = require('./feedbackcontroller');

routerF.post('/addfeedback', FeedbackController.addFeedback);
routerF.get('/feedbacks', FeedbackController.getAllFeedback);
routerF.post('/:id/like', FeedbackController.likeFeedback);
routerF.post('/:id/dislike', FeedbackController.dislikeFeedback);
routerF.post('/deleteFeedback', FeedbackController.deleteFeedback);

module.exports = routerF;