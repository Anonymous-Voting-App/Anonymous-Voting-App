import { Request, Response, Router } from 'express';

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
router.get('/', (req: Request, res: Response) => {
    // TODO: When database implemented, add health check here!
    return res.json({
        server: true,
        database: false
    });
});
