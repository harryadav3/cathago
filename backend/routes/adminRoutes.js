const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

router.get('/analytics', auth, adminController.getAnalytics);

module.exports = router;