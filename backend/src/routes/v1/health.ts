import { Router } from 'express';
import { checkHealth } from '../../controllers/healthController';

export const router = Router();

/**
 * Health check
 */
router.get('/', checkHealth);
