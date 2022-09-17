import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors, { CorsOptions } from 'cors';
import expressWinston from 'express-winston';
import Logger from './utils/logger';
import errorHandler from './utils/errorHandler';
import { notFound } from './utils/responses';

import v1Router from './routes/v1';

const app = express();
const port = 8080;

const corsOptions: CorsOptions = {
    // origin: process.env.FRONTEND_URL || 'http://localhost:3000'
    origin: '*'
};

app.use(
    expressWinston.logger({
        winstonInstance: Logger,
        msg: 'HTTP {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}',
        meta: false
    })
);
app.use(helmet());
app.use(express.json());
app.use(cors(corsOptions));

app.use('/', v1Router); // Use API V1 as default
app.use((req: Request, res: Response) => notFound(req, res));
app.use(errorHandler());

app.listen(port, () => {
    Logger.info(`Anonymous Voting App API listening on port ${port}`);
});
