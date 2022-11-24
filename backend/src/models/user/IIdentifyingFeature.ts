export type FindInDbQuery =
    | { where: { ip: string } }
    | { where: { idCookie: string } }
    | { where: { fingerprintJsId: string } };

export type PrivateData =
    | { ip: string }
    | { idCookie: string }
    | { fingerprintJsId: string };
