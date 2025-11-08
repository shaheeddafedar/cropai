const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const isAuth = require('../middleware/isAuth');

router.get('/', pageController.getHomepage);
router.get('/about', pageController.getAbout);
router.get('/analytics', pageController.getAnalytics);

router.get('/dashboard', isAuth, pageController.getDashboard);
router.get('/feedback', isAuth, pageController.getFeedback);
router.get('/recommend', isAuth, pageController.getRecommendationPage);

module.exports = router;