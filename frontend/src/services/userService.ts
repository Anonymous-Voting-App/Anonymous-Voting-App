import getBackendUrl from '../utils/getBackendUrl';
import { getAuthorizationToken } from '../utils/getAuthorizationToken';

export const fetchSearchUser = async (searchString: string) => {
    const authToken = getAuthorizationToken();

    const newResponse = await fetch(
        `${getBackendUrl()}/api/user/searchByName/${searchString}`,
        {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${authToken}`
            }
        }
    );

    if (newResponse.status !== 200) {
        throw new Error('Request Failed');
    }
    const dataList = await newResponse.json();

    return dataList;
};

export const deleteUser = async (userId: string) => {
    const newResponse = await fetch(`${getBackendUrl()}/api/user/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${getAuthorizationToken()}`
        }
    });

    if (newResponse.status !== 200) {
        throw new Error('Request Failed');
    }

    const dataList = await newResponse.json();

    return dataList;
};

export const updateUser = async (
    userId: string,
    username: string,
    adminToggle: boolean,
    newPassword: string
) => {
    const editedUserData =
        newPassword === '' || newPassword.length < 6
            ? {
                  name: username,
                  isAdmin: adminToggle
              }
            : {
                  name: username,
                  isAdmin: adminToggle,
                  password: newPassword
              };
    const response = await fetch(`${getBackendUrl()}/api/user/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(editedUserData),
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${getAuthorizationToken()}`
        }
    });

    if (response.status !== 200) {
        throw new Error('Request Failed');
    }

    const responseJSON = await response.json();
    return responseJSON;
};
