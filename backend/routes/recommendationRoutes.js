const express = require('express');
const router = express.Router();
const { getRecommendations, getPersonalizedRecommendations } = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

router.get('/:productId', getRecommendations);
router.get('/user/personalized', protect, getPersonalizedRecommendations);

module.exports = router;