const express = require('express');
const apiController = require('../controllers/apiController');
const router = express.Router();

router.post('/recommend', apiController.postRecommendation);
router.post('/feedback', apiController.postFeedback);
router.get('/analytics', apiController.getAnalyticsData);
router.get('/feedback', apiController.getFeedbacks); 
router.get('/recommend/:userId', apiController.getRecentRecommendations); 

module.exports = router;