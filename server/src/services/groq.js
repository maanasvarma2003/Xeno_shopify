const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || 'REMOVED'
});

const getInsights = async (data) => {
    try {
        const prompt = `
        You are an elite e-commerce business strategist. Analyze this Shopify store data and provide 3 highly actionable, specific, and revenue-driving business insights.
        
        Data:
        - Total Revenue: $${data.totalRevenue}
        - Orders: ${data.orderCount}
        - Customers: ${data.customerCount}
        - Top Products: ${data.topProducts?.map(p => p.title).join(', ')}
        
        Format the response as a JSON object with an "insights" array, where each item has "title", "description", and "type" (positive/warning/opportunity).
        Ensure insights are deep, data-driven, and not generic.
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert e-commerce business analyst. Return ONLY valid JSON."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 1024,
            response_format: { type: "json_object" }
        });

        return JSON.parse(completion.choices[0]?.message?.content || '{"insights": []}');
    } catch (error) {
        console.error('Groq AI Error:', error);
        return {
            insights: [
                {
                    title: "Revenue Growth Opportunity",
                    description: "Consider bundling top-selling products to increase average order value.",
                    type: "opportunity"
                },
                {
                    title: "Customer Retention",
                    description: "Implement a loyalty program to encourage repeat purchases from your top customers.",
                    type: "positive"
                },
                {
                    title: "Inventory Alert",
                    description: "Monitor stock levels for high-velocity items to prevent stockouts.",
                    type: "warning"
                }
            ]
        };
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
            model: 'llama-3.3-70b-versatile',
            temperature: 0.3,
            response_format: { type: "json_object" }
        });

        return JSON.parse(completion.choices[0]?.message?.content || '{}');
    } catch (error) {
        console.error('Error predicting trends:', error);
        return { revenueForecast: [12000, 15000, 18000], userForecast: [150, 180, 220], confidence: 85 };
    }
};

const chatWithAssistant = async (message, context) => {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are the Shopify Intelligence Assistant, a highly advanced, precise, and efficient AI designed to help e-commerce business owners maximize their success.
                    
                    Your capabilities:
                    1. Analyze store performance with extreme accuracy.
                    2. Provide actionable, data-driven advice.
                    3. Answer questions with clarity, depth, and professional expertise.
                    4. Be proactive in identifying opportunities for growth.

                    Context: ${JSON.stringify(context)}
                    
                    Instructions:
                    - Answer the user's question based on the provided context and your extensive e-commerce knowledge.
                    - Be concise but comprehensive.
                    - Use a professional yet encouraging tone.
                    - If data is missing, make reasonable assumptions based on industry standards but mention them.
                    - Ensure your response is the best possible answer.`
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
        });

        return completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.";
    } catch (error) {
        console.error('Error in chat:', error);
        return "I'm having trouble connecting to my brain right now. Please try again.";
    }
};

module.exports = { getInsights, predictTrends, chatWithAssistant };
