/**
 * Get backend URL
 * @returns Current backend URL
 */
const getBackendUrl = (): string => {
    return process.env.REACT_APP_BACKEND_URL ?? 'http://localhost:3000';
};

export default getBackendUrl;
