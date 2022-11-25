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
}

export interface PrivateData {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface PublicData {
    id: string;
}
