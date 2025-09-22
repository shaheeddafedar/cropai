const mongoose = require('mongoose');


const RecommendationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    soilPh: Number,
    moisture: Number,
    nitrogen: Number,
    phosphorus: Number,
    potassium: Number,
    temperature: Number,
    area: Number,
    rainfall: Number,
    season: String,
    state: String,
    city: String,
    pastCrop: String,
    recommendedCrop: String,
    reason: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recommendation', RecommendationSchema);