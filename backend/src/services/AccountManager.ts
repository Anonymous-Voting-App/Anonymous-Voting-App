import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as IAccountManager from './IAccountManager';
import logger from '../utils/logger';

export const createUser = async (
    email: string,
    password: string,
    username: string,
    firstName: string,
    lastName: string,
    prisma: PrismaClient
): Promise<number> => {
    try {
        // check that there is no user existing with that email
        const existingUser = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        const existingUserName = await prisma.user.findFirst({
            where: {
                username: username
            }
        });

        if (existingUser === null && existingUserName === null) {
            // create a new user
            await prisma.user.create({
                data: {
                    email: email,
                    password: await bcrypt.hash(password, 10),
                    username: username,
                    firstname: firstName,
                    lastname: lastName
                }
            });

            return 200;
        }

        return 400;
    } catch (e: unknown) {
        logger.error(e);
        return 500;
    }
};

export const verifyUser = async (
    username: string,
    password: string,
    prisma: PrismaClient
): Promise<IAccountManager.UserData | null> => {
    try {
        const existingUser = await prisma.user.findFirst({
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
        logger.error(e);
        return null;
    }
};

export const isAdmin = async (
    username: string,
    prisma: PrismaClient
): Promise<boolean> => {
    try {
        const existingUser = await prisma.user.findFirst({
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
        logger.error(e);
        return false;
    }
};
