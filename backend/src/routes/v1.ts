import { Router } from 'express';
import { router as healthRouter } from './v1/health';
import { router as pollRouter } from './v1/poll';
import { router as userRouter } from './v1/user';
import { authenticate } from '../middlewares/authenticationMiddleware';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from './v1/swagger_api_v1.json';

const router = Router();

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDoc));

router.use('/health', healthRouter);
router.use('/poll', authenticate(), pollRouter);
router.use('/user', userRouter);

export default router;
