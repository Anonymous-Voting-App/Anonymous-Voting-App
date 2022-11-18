export interface FindSelfDatabaseQuery {
    where: {
        id: string;
    };
}

export interface DatabaseData {
    id: string;
    ip?: string;
    cookie?: string;
    accountId?: string;
}
