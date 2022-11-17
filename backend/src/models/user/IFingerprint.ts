export interface DatabaseData {
    id: string;
    ip: string;
    idCookie: string;
    fingerprintJsId: string;
}

export type AllIdentifiersQueryArray = [
    { ip: string }?,
    { idCookie: string }?,
    { loginCookie: string }?,
    { id: string }?,
    { fingerprintJsId: string }?
];

export interface FindInDbOrQuery {
    where: {
        OR: AllIdentifiersQueryArray;
    };
}

export interface FindInDbAndQuery {
    where: {
        AND: AllIdentifiersQueryArray;
    };
}

export type FindInDbQuery = FindInDbOrQuery | FindInDbAndQuery;

export interface PrivateData {
    ip?: string;
    idCookie?: string;
    fingerprintJsId?: string;
}
