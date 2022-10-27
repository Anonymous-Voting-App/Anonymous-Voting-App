import { Router } from 'express';
import {
    createPoll,
    answerPoll,
    getPublicPoll,
    getPrivatePoll,
    getPollAnswers
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
router.get('/admin/:privateId', getPrivatePoll);
