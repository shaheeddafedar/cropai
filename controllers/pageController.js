
const Recommendation = require('../models/Recommendation');
const Feedback = require('../models/Feedback');

exports.getHomepage = async (req, res, next) => {
    try {
        const cropsRecommended = await Recommendation.countDocuments();
        
        const distinctUserIds = await Recommendation.distinct('userId');
        const farmersHelped = distinctUserIds.length;

        const accuracyRate = 95;

        res.render('index', { 
            pageTitle: 'Home', 
            stats: { 
                farmers: farmersHelped, 
                crops: cropsRecommended, 
                accuracy: accuracyRate
            } 
        });

    } catch (err) {
        console.error("Could not fetch homepage stats:", err);
        res.render('index', { pageTitle: 'Home', stats: { farmers: 100, crops: 50, accuracy: 95 } });
    }
};

exports.getDashboard = (req, res, next) => {
    res.render('dashboard', { pageTitle: 'Dashboard' });
};

exports.getAnalytics = (req, res, next) => {
    res.render('analytics', { pageTitle: 'Analytics' });
};

// exports.getFeedback = async (req, res, next) => {
//     try {
//         const feedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(6);
//         res.render('feedback', { pageTitle: 'Feedback', feedbacks: feedbacks });
//     } catch (err) {
//         console.error("Error fetching feedback for page:", err);
//         res.render('feedback', { pageTitle: 'Feedback', feedbacks: [] });
//     }
// };
exports.getFeedback = (req, res, next) => {
    res.render('feedback', { pageTitle: 'Feedback' });
};


exports.getAbout = (req, res, next) => {
    res.render('about', { pageTitle: 'About' });
};

exports.getRecommendationPage = (req, res, next) => {
    res.render('recommend', { pageTitle: 'Your Recommendation' });
};