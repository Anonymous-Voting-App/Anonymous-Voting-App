/**
 * Simple function that return Bearer + token if set,
 * otherwise returns empty string
 * @returns
 */
export const getAuthorizationToken = () => {
    const token = localStorage.getItem('token');
    return token !== null ? `Bearer ${token}` : '';
};
