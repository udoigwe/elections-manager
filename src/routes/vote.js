const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const validators = require('../middleware/validators');
const checkAuth = require('../middleware/checkAuth');

router.post('/votes', checkAuth.verifyToken, validators.createVote, voteController.create);
router.get('/votes', checkAuth.verifyToken, voteController.readAll);
router.get('/votes/:vote_id', checkAuth.verifyToken, validators.readSingleVote, voteController.readOne);
router.get('/ranks', checkAuth.verifyToken, voteController.readRanks);

module.exports = router;