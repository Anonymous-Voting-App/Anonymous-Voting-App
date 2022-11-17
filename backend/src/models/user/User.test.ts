import { AssertionError } from 'assert';
import { prismaMock } from '../../utils/prisma_singleton';
import User from './User';

describe('User', () => {
    describe('newDatabaseObject', () => {
        test('Create new user databaseObject', () => {
            const user = new User();

            user.setIp('test-ip');
            user.setCookie('test-cookie');
            user.setAccountId('test-account-id');

            const obj = user.newDatabaseObject();

            expect(obj).toEqual({
                email: 'dummy-email',
                name: 'dummy-name',
                password: 'dummy-password'
            });
        });

        test.todo('Properties not set');
    });

    describe('setFromDatabaseData', () => {
        test('Set user from database', () => {
            const user = new User();

            user.setFromDatabaseData({ id: '1' });

            expect(user.id()).toBe('1');
        });
    });

    describe('loadFromDatabase', () => {
        test('Data found', async () => {
            prismaMock.user.findFirst.mockResolvedValue({
                id: '6dae07ca-d63e-4dc4-96df-ee90b2fc68b2',
                createdAt: new Date(),
                updatedAt: new Date(),
                name: 'dummy-name',
                email: 'dummy@email.com',
                firstname: '',
                lastname: '',
                username: '',
                isAdmin: false,
                emailVerified: false,
                password: 'dummy-password'
            });

            const user = new User();

            user._database = prismaMock;
            user.setAccountId('1');

            await user.loadFromDatabase();

            expect(user.loadedFromDatabase()).toBe(true);
            expect(user.accountId()).toBe('1');
        });

        test('Data not found', async () => {
            prismaMock.user.findFirst.mockResolvedValue(null);

            const user = new User();

            user._database = prismaMock;
            user.setId('1');

            await user.loadFromDatabase();

            expect(user.loadedFromDatabase()).toBe(false);
        });

        test('Properties not set', async () => {
            const user = new User();

            try {
                await user.loadFromDatabase();
                expect(true).toBeFalsy();
            } catch (e: unknown) {
                if (e instanceof AssertionError) {
                    expect(e.message).toBe(
                        'either id, ip, cookie or accountId is set'
                    );
                } else {
                    expect(true).toBeFalsy();
                }
            }
        });
    });
});
