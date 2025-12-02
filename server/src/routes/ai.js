const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const auth = require('../middleware/auth'); // Assuming auth middleware exists

// Generate Insights
router.post('/insights', auth, async (req, res) => {
    try {
        const { data } = req.body;
        const insights = await aiService.generateInsights(data);
        res.json(insights);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate insights' });
    }
});

// Predict Trends
router.post('/predict', auth, async (req, res) => {
    try {
        const { historicalData } = req.body;
        const prediction = await aiService.predictTrends(historicalData);
        res.json(prediction);
    } catch (error) {
        res.status(500).json({ error: 'Failed to predict trends' });
    }
});

// Chat with Assistant
router.post('/chat', auth, async (req, res) => {
    try {
        const { message, context } = req.body;
        const response = await aiService.chatWithAssistant(message, context);
        res.json({ response });
    } catch (error) {
        res.status(500).json({ error: 'Failed to chat' });
    }
});

module.exports = router;
