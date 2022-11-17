import { UserData } from '../../services/IAccountManager';

// to make the file a module and avoid the TypeScript error
export {};

declare global {
    namespace Express {
        export interface Request {
            User?: UserData;
            UserIsAdmin?: boolean;
        }
    }
}
