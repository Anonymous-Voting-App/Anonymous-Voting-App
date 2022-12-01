import { Router } from 'express';

import { requireAdmin } from '../../middlewares/authenticationHandler';
import { router as pollAdminRouter } from './poll/admin';
import { router as pollPublicRouter } from './poll/public';

export const router = Router();

router.use('/', pollPublicRouter);
router.use('/admin', requireAdmin(), pollAdminRouter);
