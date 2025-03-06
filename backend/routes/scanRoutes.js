const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');
const auth = require('../middleware/auth');
const credit = require('../middleware/credit');

router.post('/', auth, credit, scanController.scan);
router.get('/matches/:docId', auth, scanController.getMatches);

module.exports = router;