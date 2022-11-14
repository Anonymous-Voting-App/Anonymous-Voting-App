import User from '../models/User';
import { pre, post } from '../utils/designByContract';
import prisma from '../utils/prismaHandler';
import bcrypt from 'bcryptjs';
//import { PrismaClient } from '@prisma/client';
import * as IUserManager from './IUserManager';
import * as responses from '../utils/responses';

//import userData from 'IUser'
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
// var passport = require('passport');
// var LocalStrategy = require('passport-local');
// var crypto = require('crypto');

/**
 * A service for accessing and editing the anonymous
 * voting app's users in the database.
 */
const _prisma = prisma;

// export const CreateUser = async (email: string, password: string, username: string, firstName: string, lastName: string) : Promise<number> => {
//     try {
//         // check that there is no user existing with that email
//         const existingUser = await _prisma.user.findFirst({
//             where: {
//                 email: email
//             }
//         })

//         const existingUserName = await _prisma.user.findFirst({
//             where: {
//                 username: username
//             }
//         })

//         if(existingUser === null && existingUserName === null) {
//             // create a new user
//             await _prisma.user.create({
//                 data: {
//                     email: email,
//                     password: await bcrypt.hash(password, 10),
//                     username: username,
//                     firstname: firstName,
//                     lastname: lastName,
//                     //salt: await bcrypt.genSalt(10)
//                 }
//              });
//              return 200;
//         }
//         else {
//             return 400;
//         }
//     }
//     catch (e) {
//         return 500;
//     }
// }

// export async function Login(email: string, passwordhash: string) : Promise<any> {
//     try {
//         // check that there is user existing with that email
//         let existingUser = await _prisma.user.findFirst({
//             where: {
//                 email: email
//             }
//         })

//         // returning an user if also password is correct. Don't give info if email existed.
//         if(existingUser === null) {
//             return null;
//         }
//         else {
//             if(existingUser.password === passwordhash){
//                 delete existingUser.password;
//                 delete existingUser.id;
//                 return existingUser;
//             }
//         }
//         return null;
//     }
//     catch(e) {
//         return null;
//     }
// }

export const verify = async (username: string, password: string, done: any) => {
    try {
        const existingUser = await _prisma.user.findFirst({
            where: {
                username: username
            }
        });

        // returning an user if also password is correct. Don't give info if email existed.
        if (existingUser === null) {
            return done(null, false, {
                message: 'Incorrect username or password.'
            });
        } else {
            const validpassword = await bcrypt.compare(
                password,
                existingUser.password
            );
            if (validpassword) {
                const data: IUserManager.userData = {
                    firstName: existingUser.firstname,
                    lastName: existingUser.lastname,
                    email: existingUser.email,
                    userName: existingUser.username
                };
                return done(null, data, { message: 'Success' });
            }
            return done(null, false, {
                message: 'Incorrect username or password.'
            });
        }
    } catch (e: any) {
        return done(e);
    }

    // db.get('SELECT * FROM users WHERE username = ?', [ username ], function(err, user) {
    //   if (err) { return cb(err); }
    //   if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }

    //   crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
    //     if (err) { return cb(err); }
    //     if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
    //       return cb(null, false, { message: 'Incorrect username or password.' });
    //     }
    //     return cb(null, user);
    //   });
    // });
};

// export default class UserManager {
//     _database!: PrismaClient;
//     _users: { [id: string]: User } = {};

//     /** Users that are being managed. */
//     users(): { [id: string]: User } {
//         return this._users;
//     }

//     /** Sets value of users. */

//     setUsers(users: { [id: string]: User }): void {
//         pre('argument users is of type object', typeof users === 'object');

//         this._users = users;

//         post('_users is users', this._users === users);
//     }

//     /** Database the user info is stored in. */
//     database(): PrismaClient {
//         return this._database;
//     }

//     /** Sets value of database. */
//     setDatabase(database: PrismaClient): void {
//         this._database = database;

//         post('_database is database', this._database === database);
//     }

//     constructor(database: PrismaClient) {
//         pre('database is of type object', typeof database === 'object');

    /**
     * User with either given ip, cookie or accountId.
     * If such user does not exist in database,
     * returns undefined.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getUser(userOptions: IUserManager.UserOptions): Promise<User | null> {
        const user = new User();

//     /**
//      * Creates new user with given options
//      * in database. Returns new user
//      * if it was created.
//      */
//     async createUser(
//         userOptions: IUserManager.CreateUserOptions
//     ): Promise<User | null> {
//         pre('userOptions is of type object', typeof userOptions === 'object');
//         const user = new User();

//         user.setDatabase(this.database());

//         if (typeof userOptions.ip === 'string') {
//             user.setIp(userOptions.ip);
//         }

//         if (typeof userOptions.cookie === 'string') {
//             user.setCookie(userOptions.cookie);
//         }

//         await user.createNewInDatabase();

//         if (user.createdInDatabase()) {
//             return user;
//         }

//         return null;
//     }

//     /**
//      * Whether user with any of the given information
//      * exists in database.
//      */
//     async userExists(userOptions: IUserManager.UserOptions): Promise<boolean> {
//         pre('userOptions is of type object', typeof userOptions === 'object');
//         pre(
//             'userOptions.ip is of type string',
//             typeof userOptions.ip === 'string'
//         );
//         pre(
//             'userOptions.cookie is of type string',
//             typeof userOptions.cookie === 'string'
//         );
//         pre(
//             'userOptions.accountId is of type string',
//             typeof userOptions.accountId === 'string'
//         );

//         const user = new User();
//         user.setDatabase(this.database());
//         user.setIp(userOptions.ip || '');
//         user.setCookie(userOptions.cookie || '');
//         user.setAccountId(userOptions.accountId || '');

//         return await user.existsInDatabase();
//     }

//     /**
//      * User with either given ip, cookie or accountId.
//      * If such user does not exist in database,
//      * returns undefined.
//      */
//     async getUser(userOptions: IUserManager.UserOptions): Promise<User | null> {
//         const user = new User();

//         user.setDatabase(this.database());
//         user.setId('1eb1cfae-09e7-4456-85cd-e2edfff80544');
//         user.setIp('');
//         user.setCookie('');

//         // Hard coded account id of a dummy user
//         // as a temporary solution so that
//         // voting without having a user account possible.
//         user.setAccountId('1eb1cfae-09e7-4456-85cd-e2edfff80544');

//         await user.loadFromDatabase();

//         if (user.loadedFromDatabase()) {
//             return user;
//         }

//         return null;
//     }
// }
