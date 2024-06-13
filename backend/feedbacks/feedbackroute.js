const express = require('express');
const routerF = express.Router();
const FeedbackController = require('./feedbackcontroller');

routerF.post('/addfeedback', FeedbackController.addFeedback);


module.exports = routerF;