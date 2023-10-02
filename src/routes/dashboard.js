const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const checkAuth = require('../middleware/checkAuth');

router.get('/dashboard', checkAuth.verifyToken, dashboardController.dashboard);

module.exports = router;