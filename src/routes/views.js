const express = require('express');
const router = express.Router();
const viewsController = require('../controllers/viewsController');

router.get('/', viewsController.home);
router.get('/signin', viewsController.signin);
router.get('/register', viewsController.register);

/* Admin Routes */
router.get('/admin/dashboard', viewsController.adminDashboard);

module.exports = router;