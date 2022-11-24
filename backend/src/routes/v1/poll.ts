import { Router } from 'express';
import {
    requireAdmin,
    requireUser,
    authenticate
} from '../../middlewares/authenticationHandler';
import {
    createPoll,
    answerPoll,
    getPublicPoll,
    getPrivatePoll,
    getPollAnswers,
    getPollResults,
    editPoll,
    deletePoll,
    searchByName
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
router.get('/admin/:privateId', authenticate(), requireAdmin(), getPrivatePoll);

/**
 * Gets private info of polls as admin using poll name search string
 */
router.get(
    '/admin/searchByName/:searchString',
    authenticate(),
    requireAdmin(),
    searchByName
);

/**
 * Deletes poll as admin
 */
router.delete('/admin/:privateId', authenticate(), requireAdmin(), deletePoll);

/**
 * Edits poll as admin
 */
router.patch('/admin/:privateId', authenticate(), requireAdmin(), editPoll);
