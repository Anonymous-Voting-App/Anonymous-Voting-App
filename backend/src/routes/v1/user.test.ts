import * as IUser from '../../models/user/IUser';
import bcrypt from 'bcryptjs';
import {
    ChildProcessWithoutNullStreams,
    exec,
    ExecException,
    spawn
} from 'child_process';

interface ResponseObj {
    code: number;
    message: string;
}

interface LoginResponse {
    token: string;
    user: IUser.PrivateData;
}

interface SuccessObject {
    success: true;
}

jest.setTimeout(60000);

describe.skip('integration tests for user api commands', () => {
    // Global object with the created user's info
    // shared by several tests. Instantiated
    // by the login test.
    let createdUser: IUser.PrivateData;

    // These set how long to wait after booting / shutting down server
    // to give the server time to actually finish starting / shutting down.
    // Depending on how fast your computer is you may need to increase these
    // to give the server process enough time.
    // - Joonas Halinen 31.10.2022
    const bootWait = 15000;
    const shutdownWait = 5000;
    // Whether to redirect the child server process's stdout and stderr to
    // console.
    // - Joonas Halinen 29.11.2022
    const showProcessLogs = true;

    let serverProcess: ChildProcessWithoutNullStreams;

    beforeAll(async () => {
        console.log('starting server');
        serverProcess = spawn(
            /^win/.test(process.platform) ? 'npm.cmd' : 'npm',
            ['run', 'start']
        );

        if (showProcessLogs) {
            serverProcess.stdout.on('data', (chunk) => {
                console.log(chunk.toString());
            });

            serverProcess.stderr.on('data', (chunk) => {
                console.log(chunk.toString());
            });
        }

        await new Promise((resolve) => {
            let timeout: NodeJS.Timeout;
            serverProcess.stdout.on('data', (chunk) => {
                if (!timeout && chunk.toString().includes('8080')) {
                    timeout = setTimeout(() => {
                        console.log('server started');
                        resolve(null);
                    }, bootWait);
                }
            });
        });
    });

    afterAll(async () => {
        console.log('closing server');
        serverProcess.kill();

        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(null);
            }, shutdownWait);
        });
    });

    describe('create user', () => {
        test('create user successfully', (resolve) => {
            let command = `
                curl -i -X POST -H "Content-Type: application/json" -d "{
                \\"username\\": \\"integrationTestUser\\", 
                \\"password\\": \\"123456\\",
                \\"firstname\\": \\"Integration\\",
                \\"lastname\\": \\"Test\\",
                \\"email\\": \\"test.test@test.fi\\"
            }" http://localhost:8080/api/user/signup`;

            command = formatMultiLineCommandForConsole(command);

            console.log(command);

            exec(command, (err, stdout) => {
                if (err) {
                    throw new Error('Error: ' + err);
                }

                const resultJson = extractJson(stdout);

                console.log(resultJson);

                const result = JSON.parse(resultJson);

                checkUserCreationResponse(result);

                resolve();
            });
        });
    });

    describe('login', () => {
        test('login successfully', (done) => {
            let command = `
                curl -i -X POST -H "Content-Type: application/json" -d "{
                \\"username\\": \\"integrationTestUser\\", 
                \\"password\\": \\"123456\\"
            }" http://localhost:8080/api/user/login`;

            command = formatMultiLineCommandForConsole(command);

            console.log(command);

            exec(command, (err, stdout) => {
                if (err) {
                    throw new Error('Error: ' + err);
                }

                const resultJson = extractJson(stdout);

                console.log(resultJson);

                const result = JSON.parse(resultJson);

                checkLoginResponse(result);

                // Save created user into global object
                createdUser = result.user;

                done();
            });
        });
    });

    describe('edit user', () => {
        test('edit user successfully', (done) => {
            loginAsAdmin().then((token) => {
                let command = `
                    curl -i -X PATCH -H "Authorization: Bearer ${token}" 
                    -H "Content-Type: application/json" -d "{
                    \\"userName\\": \\"editedIntegrationTestUser\\", 
                    \\"firstName\\": \\"editedFirst\\", 
                    \\"lastName\\": \\"editedLast\\", 
                    \\"password\\": \\"654321\\",
                    \\"isAdmin\\": true,
                    \\"email\\": \\"changed-email@email.fi\\"
                }" http://localhost:8080/api/user/${createdUser.id}`;

                command = formatMultiLineCommandForConsole(command);

                console.log(command);

                exec(command, (err, stdout) => {
                    if (err) {
                        throw new Error('Error: ' + err);
                    }

                    const resultJson = extractJson(stdout);

                    console.log(resultJson);

                    const result = JSON.parse(resultJson);

                    checkSuccessObject(result);

                    done();
                });
            });
        });
    });

    describe('search user by name', () => {
        test('find changed user successfully', (done) => {
            loginAsAdmin().then((token) => {
                let command = ` curl -i -X GET -H "Authorization: Bearer ${token}" 
                    http://localhost:8080/api/user/searchByName/editedIntegrationTestUser`;

                command = formatMultiLineCommandForConsole(command);

                console.log(command);

                exec(command, async (err, stdout) => {
                    if (err) {
                        throw new Error('Error: ' + err);
                    }

                    const resultJson = extractJson(stdout);

                    console.log(resultJson);

                    const result = JSON.parse(resultJson);

                    await checkFoundUsers(result, createdUser);

                    done();
                });
            });
        });
    });

    describe('delete user', () => {
        test('delete user successfully', (done) => {
            loginAsAdmin().then((token) => {
                let command = `
                    curl -i -X DELETE -H "Authorization: Bearer ${token}" 
                    http://localhost:8080/api/user/${createdUser.id}`;

                command = formatMultiLineCommandForConsole(command);

                console.log(command);

                exec(command, (err, stdout) => {
                    if (err) {
                        throw new Error('Error: ' + err);
                    }

                    const resultJson = extractJson(stdout);

                    console.log(resultJson);

                    const result = JSON.parse(resultJson);

                    checkSuccessObject(result);

                    done();
                });
            });
        });
    });
});

async function checkFoundUsers(
    users: { data: Array<IUser.PrivateData> },
    createdUser: IUser.PrivateData
) {
    expect(users.data.length).toBe(1);

    await checkEditedUser(users.data[0], createdUser);
}

function checkSuccessObject(response: SuccessObject) {
    expect(response).toEqual({ success: true });
}

async function checkEditedUser(
    user: IUser.PrivateData,
    createdUser: IUser.PrivateData
) {
    expect(user.userName).toBe('editedIntegrationTestUser');
    expect(user.firstName).toBe('editedFirst');
    expect(user.lastName).toBe('editedLast');
    expect(user.email).toBe('changed-email@email.fi');
    expect(await bcrypt.compare('654321', user.password)).toBe(true);
    expect(user.isAdmin).toBe(true);
    expect(user.id).toBe(createdUser.id);
}

function checkLoginResponse(response: LoginResponse) {
    expect(response.token.length > 0).toBe(true);
    expect(typeof response.user).toBe('object');
    expect(response.user.userName).toBe('integrationTestUser');
    expect(response.user.firstName).toBe('Integration');
    expect(response.user.lastName).toBe('Test');
    expect(response.user.email).toBe('test.test@test.fi');
    expect(response.user.id.length > 0).toBe(true);
}

function checkUserCreationResponse(response: ResponseObj) {
    expect(response.code).toBe(201);
    expect(response.message).toBe('Created');
}

async function createAdmin() {
    return new Promise<string>((resolve, reject) => {
        let command = `
            curl -i -X POST -H "Content-Type: application/json" -d "{
            \\"username\\": \\"admin\\", 
            \\"password\\": \\"123456\\",
            \\"firstname\\": \\"Ad\\",
            \\"lastname\\": \\"Min\\",
            \\"email\\": \\"joonas.halinen@tuni.fi\\"
        }" http://localhost:8080/api/user/signup`;

        command = formatMultiLineCommandForConsole(command);

        console.log(command);

        exec(command, (err, stdout) => {
            if (err) {
                throw new Error('Error: ' + err);
            }

            const resultJson = extractJson(stdout);

            console.log(resultJson);

            const result = JSON.parse(resultJson);

            resolve(result.token);
        });
    });
}

async function loginAsAdmin() {
    return new Promise<string>((resolve, reject) => {
        let command = `
            curl -i -X POST -H "Content-Type: application/json" -d "{
            \\"username\\": \\"admin\\", 
            \\"password\\": \\"123456\\"
        }" http://localhost:8080/api/user/login`;

        command = formatMultiLineCommandForConsole(command);

        console.log(command);

        exec(command, (err, stdout) => {
            if (err) {
                throw new Error('Error: ' + err);
            }

            const resultJson = extractJson(stdout);
            const result = JSON.parse(resultJson);

            resolve(result.token);
        });
    });
}

function extractJson(stdout: string): string {
    return '{' + stdout.split('\n{')[1];
}

function formatMultiLineCommandForConsole(command: string) {
    command = command.replace(/\n/g, '');
    command = command.replace(/\s+/g, ' ');
    command = command.trim();

    return command;
}
