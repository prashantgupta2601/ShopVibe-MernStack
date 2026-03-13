const express = require('express');
const router = express.Router();
const { smartSearch } = require('../controllers/searchController');

router.get('/', smartSearch);

module.exports = router;