import { Router } from 'express';
import { checkHealth, checkDbHealth } from '../../controllers/healthController';

export const router = Router();

/**
 * Health check without database
 */
router.get('/', checkHealth);

/**
 * Health check with database connection check
 */
router.get('/db', checkDbHealth);
