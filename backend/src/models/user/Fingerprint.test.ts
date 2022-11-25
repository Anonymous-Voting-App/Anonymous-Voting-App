import { prismaMock } from '../../utils/prisma_singleton';
import IPIdentifier from './IPIdentifier';
import CookieIdentifier from './/CookieIdentifier';
import Fingerprint from './Fingerprint';

describe('Fingerprint', () => {
    describe('findSelfInDbQuery', () => {
        test('query matches expected with oneOf matching', () => {
            const identifier = new IPIdentifier(prismaMock);
            identifier.setIp('ip');

            const cookieId = new CookieIdentifier(prismaMock);
            cookieId.setCookie('cookie');

            const identity = new Fingerprint(prismaMock);
            identity.identifiers().push(identifier);
            identity.identifiers().push(cookieId);

            expect(identity.findSelfInDatabaseQuery()).toEqual({
                where: {
                    OR: [
                        {
                            ip: 'ip'
                        },
                        {
                            idCookie: 'cookie'
                        }
                    ]
                }
            });
        });

        test('query matches expected with allOf matching', () => {
            const identifier = new IPIdentifier(prismaMock);
            identifier.setIp('ip');

            const cookieId = new CookieIdentifier(prismaMock);
            cookieId.setCookie('cookie');

            const identity = new Fingerprint(prismaMock);
            identity.identifiers().push(identifier);
            identity.identifiers().push(cookieId);

            identity.setSamenessCheck('allOf');

            expect(identity.findSelfInDatabaseQuery()).toEqual({
                where: {
                    AND: [
                        {
                            ip: 'ip'
                        },
                        {
                            idCookie: 'cookie'
                        }
                    ]
                }
            });
        });
    });
});
