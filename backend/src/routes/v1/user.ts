import { Router } from 'express';
import { body } from 'express-validator';
import { validationResultHandler } from '../../middlewares/validationResultHandler';
import {
    authenticate,
    requireAdmin
} from '../../middlewares/authenticationHandler';
import {
    createAccount,
    login,
    deleteUser,
    editUser,
    searchUsersByName
} from '../../controllers/userController';
export const router = Router();

/**
 * Create an account to the database
 */

router.post(
    '/signup',
    body('email')
        .not()
        .isEmpty()
        .withMessage('Email can not be empty')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .not()
        .isEmpty()
        .withMessage('Password can not be empty')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('username')
        .not()
        .isEmpty()
        .withMessage('Username can not be empty')
        .trim()
        .escape(),
    body('firstname')
        .not()
        .isEmpty()
        .withMessage('First name can not be empty')
        .trim()
        .escape(),
    body('lastname')
        .not()
        .isEmpty()
        .withMessage('Last name can not be empty')
        .trim()
        .escape(),
    validationResultHandler(),
    createAccount
);

router.post(
    '/login',
    body('username').not().isEmpty().withMessage('Username can not be empty'),
    body('password').not().isEmpty().withMessage('Password can not be empty'),
    validationResultHandler(),
    login
);

router.get(
    '/searchByName/:searchText',
    authenticate(),
    requireAdmin(),
    searchUsersByName
);

router.delete('/:id', authenticate(), requireAdmin(), deleteUser);

router.patch('/:id', authenticate(), requireAdmin(), editUser);
