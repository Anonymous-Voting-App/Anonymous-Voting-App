import getBackendUrl from '../utils/getBackendUrl';

export const login = async (username: string, password: string) => {
    const response = await fetch(`${getBackendUrl()}/api/user/login`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        }
    });

    if (response.status !== 200) {
        throw new Error('Request Failed');
    }

    const data = await response.json();
    console.log(data);

    return data;
};

export const register = async () => {
    const response = await fetch(`${getBackendUrl()}/api/user/register`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        }
    });

    if (response.status !== 200) {
        throw new Error('Request Failed');
    }

    const data = await response.json();
    console.log(data);

    return data;
};
