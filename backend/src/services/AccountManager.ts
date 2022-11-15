import prisma from '../utils/prismaHandler';
import bcrypt from 'bcryptjs';
import * as IAccountManager from './IAccountManager';
import logger from '../utils/logger';

/**
 * A service for accessing and editing the anonymous
 * voting app's users in the database.
 */
const _prisma = prisma;

export const CreateUser = async (
    email: string,
    password: string,
    username: string,
    firstName: string,
    lastName: string
): Promise<number> => {
    try {
        // check that there is no user existing with that email
        const existingUser = await _prisma.user.findFirst({
            where: {
                email: email
            }
        });

        const existingUserName = await _prisma.user.findFirst({
            where: {
                username: username
            }
        });

        if (existingUser === null && existingUserName === null) {
            // create a new user
            await _prisma.user.create({
                data: {
                    email: email,
                    password: await bcrypt.hash(password, 10),
                    username: username,
                    firstname: firstName,
                    lastname: lastName
                }
            });
            return 200;
        } else {
            return 400;
        }
    } catch (e: unknown) {
        logger.error(`Error while creating user: ${e}`);
        return 500;
    }
};

export const verify = async (
    username: string,
    password: string
): Promise<IAccountManager.UserData | null> => {
    try {
        const existingUser = await _prisma.user.findFirst({
            where: {
                username: username
            }
        });

        // returning an user if also password is correct. Don't give info if email existed.
        if (existingUser === null) {
            return null;
        }

        const validpassword = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (validpassword) {
            const data: IAccountManager.UserData = {
                id: existingUser.id,
                firstName: existingUser.firstname,
                lastName: existingUser.lastname,
                email: existingUser.email,
                userName: existingUser.username
            };

            return data;
        }

        return null;
    } catch (e: unknown) {
        logger.error(`Error while verifying JWT: ${e}`);
        return null;
    }
};

export const isAdmin = async (username: string): Promise<boolean> => {
    try {
        const existingUser = await _prisma.user.findFirst({
            where: {
                username: username
            }
        });

        if (existingUser === null) {
            return false;
        } else {
            return existingUser.isAdmin;
        }
    } catch (e: unknown) {
        logger.error(`Error while checking for admin: ${e}`);
        return false;
    }
};
