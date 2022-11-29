export interface FindSelfDatabaseQuery {
    where: {
        id: string;
    };
}

export interface DatabaseData {
    id: string;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    isAdmin: boolean;
    password: string;
}

export interface PrivateData {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    isAdmin: boolean;
    password: string;
}

export interface PublicData {
    id: string;
    userName: string;
}

export interface EditRequest {
    id: string;
    userName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    isAdmin?: boolean;
    password?: string;
}

export interface NewDatabaseObject {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    isAdmin: boolean;
    password: string;
}
