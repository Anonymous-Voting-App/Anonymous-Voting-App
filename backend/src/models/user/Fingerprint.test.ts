import { prismaMock } from '../../utils/prisma_singleton';
import IPIdentifier from './IPIdentifier';
import Fingerprint from './Fingerprint';

describe('Fingerprint', () => {
    describe('findSelfInDbQuery', () => {
        test('query matches expected with oneOf matching', () => {
            const identifier = new IPIdentifier(prismaMock);
            identifier.setIp('ip');

            const identity = new Fingerprint(prismaMock);
            identity.identifiers().push(identifier);

            expect(identity.findSelfInDatabaseQuery()).toEqual({
                where: {
                    OR: [
                        {
                            ip: 'ip'
                        }
                    ]
                }
            });
        });

        test('query matches expected with allOf matching', () => {
            const identifier = new IPIdentifier(prismaMock);
            identifier.setIp('ip');

            const identity = new Fingerprint(prismaMock);
            identity.identifiers().push(identifier);

            identity.setSamenessCheck('allOf');

            expect(identity.findSelfInDatabaseQuery()).toEqual({
                where: {
                    AND: [
                        {
                            ip: 'ip'
                        }
                    ]
                }
            });
        });
    });
});
