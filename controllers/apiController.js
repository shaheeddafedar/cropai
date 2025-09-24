const Recommendation = require('../models/Recommendation');
const Feedback = require('../models/Feedback');

const dummyCrops = [
   { name: 'Rice', reason: 'High rainfall and suitable temperature make it ideal.' },
    { name: 'Wheat', reason: 'Prefers cooler climates and moderate rainfall.' },
    { name: 'Cotton', reason: 'Requires high temperature and fertile soil.' },
    { name: 'Maize', reason: 'Thrives in well-drained soil with moderate rainfall and warm temperatures.' },
    { name: 'Sugarcane', reason: 'Needs plenty of sunlight, water, and fertile loamy soil.' },
    { name: 'Soybean', reason: 'Grows well in warm weather and requires moderate rainfall with well-drained soil.' }
];

exports.postRecommendation = async (req, res, next) => {
    try {
        const randomCrop = dummyCrops[Math.floor(Math.random() * dummyCrops.length)];
        const newRecommendation = new Recommendation({ ...req.body, recommendedCrop: randomCrop.name, reason: randomCrop.reason });
        await newRecommendation.save();
        res.status(201).json(newRecommendation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving recommendation' });
    }
};


exports.postFeedback = async (req, res, next) => {
    try {
        const { name, comment, rating } = req.body;

        if (!name || !comment || !rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'All fields are required and rating must be between 1 and 5.' });
        }

        const newFeedback = new Feedback({ name, comment, rating });
        await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting feedback' });
    }
};

exports.getFeedbacks = async (req, res, next) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feedback' });
    }
};


exports.getAnalyticsData = async (req, res, next) => {
    const { year } = req.query;
    const allFarmerGrowth = [
        { label: 'Oct 2024', count: 85, year: '2024' },
        { label: 'Nov 2024', count: 89, year: '2024' },
        { label: 'Dec 2024', count: 94, year: '2024' },
        { label: 'Jan 2025', count: 101, year: '2025' },
        { label: 'Feb 2025', count: 105, year: '2025' },
        { label: 'Mar 2025', count: 108, year: '2025' },
        { label: 'Apr 2025', count: 112, year: '2025' },
        { label: 'May 2025', count: 115, year: '2025' },
    ];

    const filteredGrowth = year === 'all'
        ? allFarmerGrowth
        : allFarmerGrowth.filter(item => item.year === year);

    const mockData = {
        mostRecommendedCrops: [
            { _id: 'Wheat', count: 150 }, { _id: 'Rice', count: 120 },
            { _id: 'Cotton', count: 90 }, { _id: 'Sugarcane', count: 75 }
        ],
        recommendationsBySeason: [
            { _id: 'Kharif', count: 210 }, { _id: 'Rabi', count: 180 }, { _id: 'Zaid', count: 45 }
        ],
        farmerGrowthByMonth: filteredGrowth,
    };
    res.status(200).json(mockData);
};

exports.getRecentRecommendations = async (req, res, next) => {
    try {
        const recommendations = await Recommendation.find({ userId: req.params.userId }).sort({ createdAt: -1 }).limit(3);
        res.status(200).json(recommendations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching history' });
    }
};