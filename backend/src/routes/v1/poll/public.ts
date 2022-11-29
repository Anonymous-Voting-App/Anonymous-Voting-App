import { Router } from 'express';
import {
    answerPoll,
    createPoll,
    getPollAnswers,
    getPollResults,
    getPublicPoll,
    getUserPolls
} from '../../../controllers/pollController';
import { requireUser } from '../../../middlewares/authenticationHandler';

export const router = Router();

/**
 * Create poll
 */
router.post('/', requireUser(), createPoll);

/**
 * Gets polls public information
 */
router.get('/:publicId', getPublicPoll);

/**
 * Answer a poll
 */
router.post('/:publicId/answers', answerPoll);

/**
 * Get answers of a poll
 */
router.get('/:publicId/answers', getPollAnswers);

/**
 * Get results of a poll
 */
router.get('/:publicId/results', getPollResults);

/**
 * Get user's own polls.
 */
router.get('/', requireUser(), getUserPolls);
