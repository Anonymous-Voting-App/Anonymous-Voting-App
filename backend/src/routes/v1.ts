import { Router } from 'express';
import { router as healthRouter } from './v1/health';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Anonymous Voting App',
            version: '1.0.0'
        }
    },
    apis: ['**/v1/*.ts']
};

const swaggerSpec = swaggerJSDoc(options);

const router = Router();

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerSpec));

router.use('/health', healthRouter);

export default router;
