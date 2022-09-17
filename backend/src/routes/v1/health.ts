import { Request, Response, Router } from 'express';

export const router = Router();

/**
 * Health check
 */
router.get('/', (req: Request, res: Response) => {
    // TODO: When database implemented, add health check here!
    return res.json({
        server: true,
        database: false
    });
});
