const express = require('express');
const pageController = require('../controllers/pageController');
const router = express.Router();

router.get('/', pageController.getHomepage);
router.get('/dashboard', pageController.getDashboard);
router.get('/analytics', pageController.getAnalytics);
router.get('/feedback', pageController.getFeedback);
router.get('/about', pageController.getAbout);
router.get('/recommend', pageController.getRecommendationPage);

module.exports = router;