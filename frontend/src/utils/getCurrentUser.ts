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
