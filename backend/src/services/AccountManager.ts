import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as IAccountManager from './IAccountManager';
import logger from '../utils/logger';
import DatabasedObjectCollection from '../models/database/DatabasedObjectCollection';
import User from '../models/user/User';
import * as IUser from '../models/user/IUser';
import { pre } from '../utils/designByContract';

async function _loadUserWithId(id: string, prisma: PrismaClient) {
    const user = new User(prisma);
    user.setId(id);

    await user.loadFromDatabase();

    return user;
}

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
                userName: existingUser.username,
                isAdmin: existingUser.isAdmin ? true : undefined
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

export const searchUsersByName = async (
    searchText: string,
    prisma: PrismaClient
): Promise<{ data: Array<IUser.PrivateData> }> => {
    pre('searchText is of type string', typeof searchText === 'string');

    const users = new DatabasedObjectCollection(new User(prisma));

    await users.loadFromDatabase({
        where: { username: { contains: searchText } }
    });

    return {
        data: Object.values(
            await users.gather('privateDataObj')
        ) as Array<IUser.PrivateData>
    };
};

export const deleteUser = async (
    id: string,
    prisma: PrismaClient
): Promise<{ success: true } | null> => {
    const user = new User(prisma);

    user.setId(id);

    await user.delete();

    return { success: true };
};

export const editUser = async (
    editOptions: IUser.EditRequest,
    prisma: PrismaClient
): Promise<{ success: true } | null> => {
    pre('editOptions is of type object', typeof editOptions === 'object');
    pre('editOptions.id is of type string', typeof editOptions.id === 'string');

    const user = await _loadUserWithId(editOptions.id, prisma);

    if (user.loadedFromDatabase()) {
        await user.updateFromEditRequest(editOptions);

        return { success: true };
    }

    return null;
};
