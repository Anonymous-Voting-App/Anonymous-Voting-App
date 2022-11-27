import { Router } from 'express';

import {
    answerPoll,
    createPoll,
    getPollAnswers,
    getPollResults,
    getPublicPoll
} from '../../../controllers/pollController';

export const router = Router();

/**
 * Create poll
 */
router.post('/', createPoll);

/**
 * Gets polls public information
 */
router.get('/:publicId', getPublicPoll);

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
