import { Router } from 'express';
import { router as healthRouter } from './v1/health';

const router = Router();

router.use('/health', healthRouter);

export default router;
