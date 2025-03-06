const express = require('express');
const router = express.Router();
const creditController = require('../controllers/creditController');
const auth = require('../middleware/auth');

router.post('/request', auth, creditController.requestCredits);
router.post('/approve/:requestId', auth, creditController.approveCredits);
router.get('/requests', auth, creditController.getRequests);

module.exports = router;