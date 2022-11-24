import {
    ChildProcessWithoutNullStreams,
    exec,
    ExecException,
    spawn
} from 'child_process';

describe.skip('integration tests for user api commands', () => {
    test('', () => {
        console.log('');
    });
});

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

function extractJson(stdout: string): string {
    return '{' + stdout.split('\n{')[1];
}

function formatMultiLineCommandForConsole(command: string) {
    command = command.replace(/\n/g, '');
    command = command.replace(/\s+/g, ' ');
    command = command.trim();

    return command;
}
