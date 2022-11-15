export interface CreateUser {
    email?: string;
    passwordHash?: string;
}

export interface UserData {
    email: string;
    userName: string;
    firstName: string;
    lastName: string;
}
