import { Router } from 'express';

import {
    deletePoll,
    editPoll,
    getPrivatePoll,
    searchByName
} from '../../../controllers/pollController';

export const router = Router();

// All endpoints placed in this file require admin account

/**
 * Gets polls info for admin view
 */
router.get('/:privateId', getPrivatePoll);

/**
 * Gets private info of polls as admin using poll name search string
 */
router.get('/searchByName/:searchString', searchByName);

/**
 * Deletes poll as admin
 */
router.delete('/:privateId', deletePoll);

/**
 * Edits poll as admin
 */
router.patch('/:privateId', editPoll);
