const { validate } = require('../utils/functions');
const authValidations = require('../validations/auth.validation');
const electionValidations = require('../validations/election.validation');
const candidateValidations = require('../validations/candidate.validation');
const voteValidations = require('../validations/vote.validation');

module.exports = {
    /* Auth route validators */
    signUp: validate(authValidations.signUp),
    login: validate(authValidations.login),

    /* Election route validators */
    createElection: validate(electionValidations.create),
    updateElection: validate(electionValidations.update),
    readSingleElection: validate(electionValidations.readOne),
    deleteOne: validate(electionValidations.deleteOne),
    
    /* Candidate route validators */
    createCandidate: validate(candidateValidations.create),
    readSingleCandidate: validate(candidateValidations.readOne),
    updateCandidate: validate(candidateValidations.update),
    deleteOneCandidate: validate(candidateValidations.deleteOne),

    /* Vote route validators */
    createVote: validate(voteValidations.create),
    readSingleVote: validate(voteValidations.readOne),
}