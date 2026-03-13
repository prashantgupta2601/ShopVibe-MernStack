const Product = require('../models/Product');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.smartSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json({ products: [], suggestions: [] });
    }

    // Basic text search
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
      ],
    }).limit(20);

    // AI-powered suggestions
    let suggestions = [];
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful e-commerce search assistant. Provide 3-5 relevant search suggestions based on the user query. Return only the suggestions as a JSON array of strings.',
          },
          {
            role: 'user',
            content: `User searched for: "${q}". Suggest related search terms.`,
          },
        ],
        max_tokens: 100,
      });
      const response = completion.choices[0].message.content.trim();
      suggestions = JSON.parse(response);
    } catch (aiError) {
      console.log('AI search suggestions failed:', aiError.message);
      // Fallback to basic suggestions
      suggestions = [`${q} accessories`, `${q} deals`, `best ${q}`];
    }

    res.json({ products, suggestions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};