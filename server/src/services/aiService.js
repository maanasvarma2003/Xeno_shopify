const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || 'gsk_yO8pX9X9X9X9X9X9X9X9X9X9X9X9X9X9X9X9X9X9X9X9X9X9', // Placeholder if not found
});

const generateInsights = async (data) => {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are an advanced AI business analyst. Analyze the provided e-commerce data and generate 3 key concise insights with percentage trends. Format as JSON array of objects with keys: title, value, change, description.'
                },
                {
                    role: 'user',
                    content: JSON.stringify(data)
                }
            ],
            model: 'mixtral-8x7b-32768',
            temperature: 0.5,
        });

        return JSON.parse(completion.choices[0]?.message?.content || '[]');
    } catch (error) {
        console.error('Error generating insights:', error);
        return [];
    }
};

const predictTrends = async (historicalData) => {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a predictive analytics AI. Based on the historical data, predict the next 3 months of revenue and user growth. Return JSON object with keys: revenueForecast (array of numbers), userForecast (array of numbers), confidence (number 0-100).'
                },
                {
                    role: 'user',
                    content: JSON.stringify(historicalData)
                }
            ],
            model: 'llama3-70b-8192',
            temperature: 0.3,
        });

        return JSON.parse(completion.choices[0]?.message?.content || '{}');
    } catch (error) {
        console.error('Error predicting trends:', error);
        return { revenueForecast: [], userForecast: [], confidence: 0 };
    }
};

const chatWithAssistant = async (message, context) => {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are Shopify Intelligence Assistant, a helpful AI for e-commerce business owners. 
                    Context: ${JSON.stringify(context)}
                    Answer the user's question based on the context and general e-commerce knowledge. Keep answers concise and actionable.`
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            model: 'llama3-70b-8192',
            temperature: 0.7,
        });

        return completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.";
    } catch (error) {
        console.error('Error in chat:', error);
        return "I'm having trouble connecting to my brain right now. Please try again.";
    }
};

module.exports = {
    generateInsights,
    predictTrends,
    chatWithAssistant
};
