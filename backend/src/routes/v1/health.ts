import { Router } from 'express';
import { checkHealth } from '../../controllers/healthController';

export const router = Router();

/**
 * Health check
 * @openapi
 * /api/health:
 *  get:
 *    description: Health check for backend and database connection
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Status of server and database
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                server:
 *                  type: boolean
 *                  example: true
 *                database:
 *                  type: boolean
 *                  example: false
 */
router.get('/', checkHealth);
