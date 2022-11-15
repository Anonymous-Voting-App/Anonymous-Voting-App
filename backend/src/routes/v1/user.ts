import { Router } from 'express';
import { createAccount, login } from '../../controllers/userController';
export const router = Router();

/**
 * Create an account to the database
 */

router.post('/signup', createAccount);
router.post('/login', login);
