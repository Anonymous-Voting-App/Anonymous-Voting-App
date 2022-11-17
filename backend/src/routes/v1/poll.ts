import { Router } from 'express';
import {
    requireAdmin,
    requireUser
} from '../../middlewares/authenticationHandler';
import {
    createPoll,
    answerPoll,
    getPublicPoll,
    getPrivatePoll,
    getPollAnswers,
    getPollResults
} from '../../controllers/pollController';

export const router = Router();

/**
 * Create poll
 */
router.post('/', createPoll);

/**
 * Get answers of a poll
 */
router.get('/:publicId/answers', getPollAnswers);

/**
 * Get results of a poll
 */
router.get('/:publicId/results', getPollResults);

/**
 * Answer poll
 */
router.post('/:publicId/answers', answerPoll);

/**
 * Gets polls public information
 */
router.get('/:publicId', getPublicPoll);

/**
 * Gets polls info for admin view
 */
router.get('/admin/:privateId', requireAdmin(), getPrivatePoll);
