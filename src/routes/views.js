const express = require('express');
const router = express.Router();
const viewsController = require('../controllers/viewsController');

router.get('/', viewsController.home);
router.get('/signin', viewsController.signin);
router.get('/register', viewsController.register);

/* Admin Routes */
router.get('/admin/dashboard', viewsController.adminDashboard);
router.get('/admin/candidates', viewsController.candidates);
router.get('/admin/votes', viewsController.votes);
router.get('/admin/users', viewsController.users);

/* Voter Routes */
router.get('/voter/dashboard', viewsController.voterDashboard);

module.exports = router;