import { AssertionError } from 'assert';
import { prismaMock } from '../../utils/prisma_singleton';
import User from './User';

describe('User', () => {
    describe('setFromDatabaseData', () => {
        test('Set user from database', () => {
            const user = new User();

            user.setFromDatabaseData({
                id: '1',
                firstname: 'first',
                lastname: 'last',
                username: 'user',
                email: 'email',
                password: 'pass',
                isAdmin: true
            });

            expect(user.id()).toBe('1');
            expect(user.firstName()).toBe('first');
            expect(user.lastName()).toBe('last');
            expect(user.userName()).toBe('user');
            expect(user.email()).toBe('email');
            expect(user.password()).toBe('pass');
            expect(user.isAdmin()).toBe(true);
        });
    });

    describe('loadFromDatabase', () => {
        test('Data found', async () => {
            prismaMock.user.findFirst.mockResolvedValue({
                id: '6dae07ca-d63e-4dc4-96df-ee90b2fc68b2',
                createdAt: new Date(),
                updatedAt: new Date(),
                email: 'dummy@email.com',
                firstname: 'first',
                lastname: 'last',
                username: 'user',
                isAdmin: false,
                emailVerified: false,
                password: 'dummy-password'
            });

            const user = new User();

            user._database = prismaMock;
            user.setId('1');

            await user.loadFromDatabase();

            expect(user.loadedFromDatabase()).toBe(true);
            expect(user.id()).toBe('6dae07ca-d63e-4dc4-96df-ee90b2fc68b2');
            expect(user.firstName()).toBe('first');
            expect(user.lastName()).toBe('last');
            expect(user.userName()).toBe('user');
            expect(user.email()).toBe('dummy@email.com');
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
                    expect(e.message).toBe('id is set');
                } else {
                    expect(true).toBeFalsy();
                }
            }
        });
    });
});
