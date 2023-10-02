const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const validators = require('../middleware/validators');
const checkAuth = require('../middleware/checkAuth');

router.post('/candidates', checkAuth.isAdminCheck, validators.createCandidate, candidateController.create);
router.get('/candidates', checkAuth.verifyToken, candidateController.readAll);
router.get('/candidates/:candidate_id', checkAuth.verifyToken, validators.readSingleCandidate, candidateController.readOne);
router.put('/candidates/:candidate_id', checkAuth.isAdminCheck, validators.updateCandidate, candidateController.update);
router.delete('/candidates/:candidate_id', checkAuth.isAdminCheck, validators.deleteOneCandidate, candidateController.deleteOne);

module.exports = router;