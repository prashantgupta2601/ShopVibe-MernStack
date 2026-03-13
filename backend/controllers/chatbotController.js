const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.chatbotResponse = async (req, res) => {
  try {
    const { message } = req.body;

    const systemPrompt = `
You are a helpful customer support chatbot for an e-commerce platform similar to Amazon/Flipkart.
Answer questions about:
- Product information
- Shipping and delivery
- Return and refund policies
- Order tracking
- Payment methods
- General help

Be friendly, concise, and accurate. If you don't know something, say so.
Our policies:
- Free shipping on orders over $50
- 30-day return policy
- COD and online payments accepted
- Delivery within 3-7 business days
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 200,
    });

    const response = completion.choices[0].message.content.trim();

    res.json({ response });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ message: 'Sorry, I am unable to respond right now.' });
  }
};