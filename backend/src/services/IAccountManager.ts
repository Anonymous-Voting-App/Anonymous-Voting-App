export interface CreateUser {
    email?: string;
    passwordHash?: string;
}

export interface UserData {
    id: string;
    email: string;
    userName: string;
    firstName: string;
    lastName: string;
    isAdmin?: boolean;
}
