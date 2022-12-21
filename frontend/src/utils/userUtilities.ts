import { CurrentUser } from './types';

/**
 * Utility for returning data of currently logged in user
 * @returns
 */
export const getCurrentUser = (): CurrentUser | null => {
    const userText = localStorage.getItem('user');

    if (userText === null) {
        return null;
    }

    const user: CurrentUser = JSON.parse(userText);
    return user;
};

/**
 * Return true if user is logged in
 * Doesn't check if the token is expired
 * @returns
 */
export const userIsLoggedIn = (): Boolean => {
    const token = localStorage.getItem('token');
    return typeof token === 'string';
};

/**
 * Return true if the logged in user is admin
 * Doesn't check if the token is expired
 * @returns
 */
export const userIsAdmin = (): Boolean => {
    return getCurrentUser()?.isAdmin ?? false;
};
