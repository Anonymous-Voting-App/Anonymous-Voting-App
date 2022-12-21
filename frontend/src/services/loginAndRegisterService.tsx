import getBackendUrl from '../utils/getBackendUrl';

export const login = async (username: string, password: string) => {
    const userContent = {
        username: username,
        password: password
    };
    const response = await fetch(`${getBackendUrl()}/api/user/login`, {
        method: 'POST',
        body: JSON.stringify(userContent),
        headers: {
            'Content-type': 'application/json'
        }
    });

    if (response.status !== 200) {
        throw new Error('Request Failed');
    }

    const data = await response.json();
    return data;
};

export const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('exp');
};

export const register = async (
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    email: string
) => {
    const userContent = {
        username: username,
        password: password,
        firstname: firstName,
        lastname: lastName,
        email: email
    };
    const response = await fetch(`${getBackendUrl()}/api/user/signup`, {
        method: 'POST',
        body: JSON.stringify(userContent),
        headers: {
            'Content-type': 'application/json'
        }
    });
    if (response.status !== 201) {
        const data = await response.json();
        // console.log(data)
        // throw new Error(data.message);
        return data;
    }

    const data = await response.json();

    return data;
};
