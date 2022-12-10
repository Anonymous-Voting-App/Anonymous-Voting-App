import * as IPolling from '../../models/IPolling';
import * as IQuestion from '../../models/IQuestion';
import * as IMultiQuestion from '../../models/IMultiQuestion';
import {
    ChildProcessWithoutNullStreams,
    exec,
    ExecException,
    spawn
} from 'child_process';

const admin = {
    name: 'admin',
    password: '123456',
    id: '68e83b78-b6ec-432b-a3a8-6caf2feb0149'
};

jest.setTimeout(60000);

describe.skip('integration tests for poll api', () => {
    // The tests first create a poll and then this created
    // poll is used for the further tests.
    let createdPoll: IPolling.PollData;

    let serverProcess: ChildProcessWithoutNullStreams;

    // These set how long to wait after booting / shutting down server
    // to give the server time to actually finish starting / shutting down.
    // Depending on how fast your computer is you may need to increase these
    // to give the server process enough time.
    // - Joonas Halinen 31.10.2022
    const bootWait = 5000;
    const shutdownWait = 5000;
    // Whether to redirect the child server process's stdout and stderr to
    // console.
    // - Joonas Halinen 29.11.2022
    const showProcessLogs = true;

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

    describe('poll creation', () => {
        const commandWithoutAuthHeader = `
            -H "Content-Type: application/json" -d "{
                \\"name\\": \\"testPoll1\\", 
                \\"type\\": \\"testType\\", 
                \\"questions\\": [ 
                    { 
                        \\"title\\": \\"questionTitle\\", 
                        \\"description\\": \\"questionDescription\\", 
                        \\"type\\": \\"multi\\", 
                        \\"minAnswers\\": 1, 
                        \\"maxAnswers\\": 4, 
                        \\"subQuestions\\": [ 
                            { 
                                \\"title\\": \\"sub-title\\", 
                                \\"description\\": \\"sub-description\\", 
                                \\"type\\": \\"free\\",
                                \\"visualType\\": \\"visual-type\\"
                            },
                            { 
                                \\"title\\": \\"sub-title\\", 
                                \\"description\\": \\"sub-description\\", 
                                \\"type\\": \\"boolean\\",
                                \\"visualType\\": \\"visual-type\\"
                            }
                        ] 
                    }, 
                    { 
                        \\"title\\": \\"questionTitle\\", 
                        \\"description\\": \\"questionDescription\\", 
                        \\"type\\": \\"scale\\", 
                        \\"minValue\\": 0.001, 
                        \\"maxValue\\": 0.004,
                        \\"step\\": 0.001
                    }, 
                    { 
                        \\"title\\": \\"questionTitle\\", 
                        \\"description\\": \\"questionDescription\\", 
                        \\"type\\": \\"number\\", 
                        \\"step\\": 2
                    },
                    { 
                        \\"title\\": \\"questionTitle\\", 
                        \\"description\\": \\"questionDescription\\", 
                        \\"type\\": \\"boolean\\"
                    }
                ],
                \\"visualFlags\\": [\\"test1\\", \\"test2\\"] 
            }" http://localhost:8080/api/poll`;

        test('create poll successfully while logged in', (resolve) => {
            loginAsCreator().then((token) => {
                let command =
                    `curl -i -X POST -H "Authorization: Bearer ${token}" ` +
                    commandWithoutAuthHeader;

                command = formatMultiLineCommandForConsole(command);

                console.log(command);

                exec(command, async (err, stdout) => {
                    if (err) {
                        throw err;
                    }

                    const resultJson = extractJson(stdout);

                    console.log(resultJson);

                    const poll: IPolling.PollData = JSON.parse(resultJson);

                    checkUneditedPrivatePoll(poll);

                    // Save poll into global for further tests.
                    createdPoll = poll;

                    resolve();
                });
            });
        });

        test('create poll successfully without being logged in', (resolve) => {
            let command = `curl -i -X POST ` + commandWithoutAuthHeader;

            command = formatMultiLineCommandForConsole(command);

            console.log(command);

            exec(command, async (err, stdout) => {
                if (err) {
                    throw err;
                }

                const resultJson = extractJson(stdout);

                console.log(resultJson);

                const poll: IPolling.PollData = JSON.parse(resultJson);

                checkUneditedPrivatePoll(poll, false, true);

                resolve();
            });
        });
    });

    test('answer poll successfully', (resolve) => {
        const command = answerPollCommand();
        console.log(command);

        exec(command, handleAnswerResponse.bind(null, resolve));
    });

    // Disabled since we don't do any double-vote blocking
    // on the backend for now.
    // - Joonas Halinen 21.11.2022
    test.skip('fail trying to answer poll second time', (resolve) => {
        const command = answerPollCommand();

        exec(command, (err, stdout) => {
            const resultJson = extractJson(stdout);

            console.log(resultJson);

            const result = JSON.parse(resultJson);

            expect(result.code).toBe(403);

            resolve();
        });
    });

    test('get poll with public id', (resolve) => {
        exec(
            `curl -i -X GET http://localhost:8080/api/poll/${createdPoll.publicId}`,
            (err, stdout) => {
                if (err) {
                    throw err;
                }

                const resultJson = extractJson(stdout);

                console.log(resultJson);

                checkUneditedPublicPoll(JSON.parse(resultJson));

                resolve();
            }
        );
    });

    test('get poll results with public id', (resolve) => {
        exec(
            `curl -i -X GET http://localhost:8080/api/poll/${createdPoll.publicId}/results`,
            (err, stdout) => {
                if (err) {
                    throw err;
                }

                const resultJson = extractJson(stdout);

                console.log(resultJson);

                checkResults(JSON.parse(resultJson));

                resolve();
            }
        );
    });

    test('get private polls as creator', (resolve) => {
        loginAsCreator().then((token) => {
            let command = `curl -i -X GET -H "Authorization: Bearer ${token}" 
                             http://localhost:8080/api/poll/`;
            command = formatMultiLineCommandForConsole(command);
            console.log(command);

            exec(command, (err, stdout) => {
                if (err) {
                    throw err;
                }

                const resultJson = extractJson(stdout);

                console.log(resultJson);

                const data = JSON.parse(resultJson);

                expect(data.data.length > 1).toBe(true);

                // Assuming the last poll is the latest.
                // May not be always true.
                // -Joonas Halinen 29.11.2022
                checkUneditedPrivatePoll(data.data[data.data.length - 1], true);

                resolve();
            });
        });
    });

    test('edit poll as admin', (resolve) => {
        loginAsAdmin().then((token) => {
            let command = `
                curl -i -X PATCH -H "Authorization: Bearer ${token}"
                -H "Content-Type: application/json" -d "{
                \\"name\\": \\"changed-name\\", 
                \\"owner\\": \\"${admin.id}\\",
                \\"visualFlags\\": [\\"changed-flag\\"] 
            }" http://localhost:8080/api/poll/admin/${createdPoll.privateId}`;

            command = formatMultiLineCommandForConsole(command);

            console.log(command);

            exec(command, (err, stdout) => {
                if (err) {
                    throw new Error('Error: ' + err);
                }

                const resultJson = extractJson(stdout);
                const result = JSON.parse(resultJson);

                expect(result).toEqual({ success: true });

                resolve();
            });
        });
    });

    test('get private poll info as admin', (resolve) => {
        loginAsAdmin().then((token) => {
            let command = `curl -i -X GET -H "Authorization: Bearer ${token}" 
                             http://localhost:8080/api/poll/admin/${createdPoll.privateId}`;
            command = formatMultiLineCommandForConsole(command);
            console.log(command);

            exec(command, (err, stdout) => {
                if (err) {
                    throw err;
                }

                const resultJson = extractJson(stdout);

                console.log(resultJson);

                checkEditedPrivatePoll(JSON.parse(resultJson));

                resolve();
            });
        });
    });

    test('search as admin', (resolve) => {
        loginAsAdmin().then((token) => {
            let command = `curl -i -X GET -H "Authorization: Bearer ${token}" 
                             http://localhost:8080/api/poll/admin/searchByName/test`;
            command = formatMultiLineCommandForConsole(command);
            console.log(command);

            exec(command, (err, stdout) => {
                if (err) {
                    throw err;
                }

                const resultJson = extractJson(stdout);

                console.log(resultJson);

                checkSearchedPolls(JSON.parse(resultJson).data, 'test');

                resolve();
            });
        });
    });

    test('delete poll as admin', (resolve) => {
        loginAsAdmin().then((token) => {
            let command = `
                curl -i -X DELETE -H "Authorization: Bearer ${token}" 
                http://localhost:8080/api/poll/admin/${createdPoll.privateId}`;

            command = formatMultiLineCommandForConsole(command);

            console.log(command);

            exec(command, (err, stdout) => {
                if (err) {
                    throw new Error('Error: ' + err);
                }

                const resultJson = extractJson(stdout);
                const result = JSON.parse(resultJson);

                expect(result).toEqual({ success: true });

                resolve();
            });
        });
    });

    async function loginAsCreator() {
        return loginAs('test-poll-creator', '123456');
    }

    async function loginAsAdmin() {
        return loginAs(admin.name, admin.password);
    }

    async function loginAs(userName: string, password: string) {
        return new Promise<string>((resolve, reject) => {
            let command = `
                curl -i -X POST -H "Content-Type: application/json" -d "{
                \\"username\\": \\"${userName}\\", 
                \\"password\\": \\"${password}\\"
            }" http://localhost:8080/api/user/login`;

            command = formatMultiLineCommandForConsole(command);

            console.log(command);

            exec(command, (err, stdout) => {
                if (err) {
                    throw new Error('Error: ' + err);
                }

                const resultJson = extractJson(stdout);
                const result = JSON.parse(resultJson);

                console.log(resultJson);

                resolve(result.token);
            });
        });
    }

    function sortQuestions(questions: Array<{ type: string }>) {
        type Typed = { type: string };

        questions.sort((elem1: Typed, elem2: Typed) => {
            if (elem1.type < elem2.type) {
                return -1;
            } else if (elem1.type == elem2.type) {
                return 0;
            } else {
                return 1;
            }
        });
    }

    function answerPollCommand() {
        const multiQuestion = createdPoll
            .questions[1] as IPolling.MultiQuestionData;
        const scaleQuestion = createdPoll.questions[3];
        const numberQuestion = createdPoll.questions[2];
        const booleanQuestion = createdPoll.questions[0];

        let command = `curl -i -X POST -H "Content-Type: application/json" -d "{
            \\"answers\\": [
                {
                    \\"questionId\\": \\"${multiQuestion.id}\\",
                    \\"data\\": {
                        \\"subQuestionIds\\": [
                            \\"${multiQuestion.subQuestions[0].id}\\",
                            \\"${multiQuestion.subQuestions[1].id}\\"
                        ],
                        \\"answer\\": [ 
                            { 
                                \\"answer\\": \\"free-text-answer\\" 
                            },
                            { 
                                \\"answer\\": true
                            }
                        ] 
                    }
                },
                {
                    \\"questionId\\": \\"${scaleQuestion.id}\\",
                    \\"data\\": {
                        \\"answer\\": 0.002
                    }
                },
                {
                    \\"questionId\\": \\"${numberQuestion.id}\\",
                    \\"data\\": {
                        \\"answer\\": 2
                    }
                }
            ]
        }" http://localhost:8080/api/poll/${createdPoll.publicId}/answers`;

        command = formatMultiLineCommandForConsole(command);
        console.log(command);

        return command;
    }

    function handleAnswerResponse(
        resolve: jest.DoneCallback,
        err: ExecException | null,
        stdout: string
    ) {
        if (err) {
            throw err;
        }

        const resultJson = extractJson(stdout);

        console.log(resultJson);

        const result = JSON.parse(resultJson);

        expect(typeof result === 'object').toBe(true);
        expect(result.success).toBe(true);

        resolve();
    }

    function checkSearchedPolls(
        polls: Array<IPolling.PollData>,
        searchText: string
    ) {
        expect(polls.length > 0).toBe(true);
        console.log('Polls found: ' + polls.length);

        for (let i = 0; i < polls.length; i++) {
            const poll = polls[i];

            console.log('Found poll: ' + poll.name + ', ' + poll.id);
            expect(poll.name.includes(searchText)).toBe(true);

            if (typeof poll.owner === 'object' && poll.owner !== null) {
                expect(
                    (poll.owner as { userName: string }).userName.length > 0
                ).toBe(true);
                expect((poll.owner as { id: string }).id.length > 0).toBe(true);
            }
        }
    }

    function checkResults(results: IPolling.ResultData) {
        expect(results.answerCount).toBe(1);
        expect(results.questions.length).toBe(4);
        expect(results.visualFlags).toEqual(['test1', 'test2']);
        expect(Object.keys(results.questions)).toEqual(
            Object.keys(createdPoll.questions)
        );
        checkQuestionResults(results.questions);
    }

    function checkQuestionResults(questions: Array<IQuestion.ResultData>) {
        checkMultiQuestionResults(questions[0] as IMultiQuestion.ResultData);
        checkScaleQuestionResult(questions[1]);
        checkNumberQuestionResult(questions[2]);
        checkBooleanQuestionResult(questions[3]);
    }

    function checkScaleQuestionResult(question: IQuestion.ResultData) {
        checkGenericQuestionResult(question);

        expect(question.answerCount).toBe(1);
        expect(question.answerPercentage).toBe(1);
        expect(question.answerValueStatistics).toEqual([
            {
                value: '0.002',
                count: 1,
                percentage: 1
            }
        ]);
    }

    function checkNumberQuestionResult(question: IQuestion.ResultData) {
        checkGenericQuestionResult(question);

        expect(question.answerCount).toBe(1);
        expect(question.answerPercentage).toBe(1);
        expect(question.answerValueStatistics).toEqual([
            {
                value: '2',
                count: 1,
                percentage: 1
            }
        ]);
    }

    function checkMultiQuestionResults(
        multiQuestion: IMultiQuestion.ResultData
    ) {
        checkGenericQuestionResult(multiQuestion);
        expect(multiQuestion.answerCount).toBe(1);
        expect(multiQuestion.answerPercentage).toBe(1);
        expect(multiQuestion.type).toBe('multi');
        expect(multiQuestion.subQuestions.length).toBe(2);
        checkFirstSubQuestionResults(multiQuestion.subQuestions[0]);
        checkSecondSubQuestionResults(multiQuestion.subQuestions[1]);
    }

    function checkFirstSubQuestionResults(question: IQuestion.ResultData) {
        checkGenericSubQuestionResult(question);
        expect(question.answerCount).toBe(1);
        expect(question.answerPercentage).toBe(1);
        expect(question.type).toBe('free');
        expect(question.visualType).toBe('visual-type');

        const valueStatistic1 = {
            value: 'free-text-answer',
            count: 1,
            percentage: 1
        };

        expect(question.answerValueStatistics).toEqual([valueStatistic1]);
    }

    function checkSecondSubQuestionResults(question: IQuestion.ResultData) {
        checkGenericSubQuestionResult(question);
        expect(question.answerCount).toBe(1);
        expect(question.answerPercentage).toBe(1);
        expect(question.type).toBe('boolean');
        expect(question.visualType).toBe('visual-type');
        expect(question.answerValueStatistics).toEqual([
            {
                value: 'true',
                count: 1,
                percentage: 1
            },
            {
                value: 'false',
                count: 0,
                percentage: 0
            }
        ]);
    }

    function checkGenericSubQuestionResult(question: IQuestion.ResultData) {
        expect(question.title).toBe('sub-title');
        expect(question.description).toBe('sub-description');
        expect(question.id.length > 0).toBe(true);
        expect(question.pollId).toBe(createdPoll.id);
    }

    function checkGenericQuestionResult(question: IQuestion.ResultData) {
        expect(question.title).toBe('questionTitle');
        expect(question.description).toBe('questionDescription');
        expect(question.id.length > 0).toBe(true);
        expect(question.pollId).toBe(createdPoll.id);
    }

    function checkBooleanQuestionResult(question: IQuestion.ResultData) {
        checkGenericQuestionResult(question);

        expect(question.answerCount).toBe(1);
        expect(question.answerPercentage).toBe(1);
        expect(question.trueAnswerCount).toBe(0);
        expect(question.falseAnswerCount).toBe(1);
        expect(question.answerValueStatistics).toEqual([
            {
                value: 'true',
                count: 0,
                percentage: 0
            },
            {
                value: 'false',
                count: 1,
                percentage: 1
            }
        ]);
    }

    function checkAnswers(answers: IPolling.AnswersData) {
        expect(answers.answers.length).toBe(4);

        checkAnswer(answers.answers[0]);
    }

    function checkAnswer(answer: IPolling.AnswerData) {
        expect(answer.id.length > 0).toBe(true);
        expect(answer.questionId.length > 0).toBe(true);
        expect(answer.value).toBe('');

        checkSubAnswer(answer.subAnswers[0]);
    }

    function checkSubAnswer(subAnswer: IPolling.AnswerData) {
        expect(subAnswer.id.length > 0).toBe(true);
        expect(subAnswer.questionId.length > 0).toBe(true);
        expect(subAnswer.value).toBe('true');
    }

    function checkUneditedPrivatePoll(
        poll: IPolling.PollData,
        omitQuestions = false,
        omitCreator = false
    ) {
        if (!omitCreator) {
            expect(poll.owner).toEqual({
                id: '28617090-09df-4869-b3a0-cec3ae324aed',
                userName: 'test-poll-creator'
            });
        }
        expect((poll.id as string).length > 0).toBe(true);

        checkUneditedPublicPoll(poll, omitQuestions);
    }

    // For checking as admin
    function checkEditedPrivatePoll(poll: IPolling.PollData) {
        expect((poll.id as string).length > 0).toBe(true);
        checkEditedPublicPoll(poll);
        expect(poll.owner).toEqual({
            id: admin.id,
            userName: admin.name
        });
    }

    function checkEditedPublicPoll(poll: IPolling.PollData) {
        expect(poll.name).toBe('changed-name');
        expect(poll.visualFlags).toEqual(['changed-flag']);
        checkPublicPoll(poll);
    }

    function checkUneditedPublicPoll(
        poll: IPolling.PollData,
        omitQuestions = false
    ) {
        expect(poll.name).toBe('testPoll1');
        expect(poll.visualFlags).toEqual(['test1', 'test2']);
        if (!omitQuestions) {
            checkPublicPoll(poll);
        }
    }

    function checkPublicPoll(poll: IPolling.PollData) {
        sortQuestions(poll.questions);

        expect(poll.questions.length).toBe(4);

        checkMultiQuestion(
            poll.questions[1] as IPolling.MultiQuestionData,
            poll
        );
        checkScaleQuestion(poll.questions[3], poll);
        checkNumberQuestion(poll.questions[2], poll);
        checkBooleanQuestion(poll.questions[0], poll);
    }

    function checkMultiQuestion(
        question: IPolling.MultiQuestionData,
        poll: IPolling.PollData
    ) {
        checkGenericQuestion(question, poll, 'multi');
        expect(question.subQuestions.length).toBe(2);
        expect(question.minAnswers).toBe(1);
        expect(question.maxAnswers).toBe(4);

        checkSubQuestion(question.subQuestions[0]);
        checkSubQuestion(question.subQuestions[1]);
    }

    function checkSubQuestion(question: IPolling.QuestionData) {
        expect(question.id.length > 0).toBe(true);
        expect(question.visualType).toBe('visual-type');
        expect(question.title).toBe('sub-title');
        expect(question.description).toBe('sub-description');
    }

    function checkScaleQuestion(
        question: IPolling.QuestionData,
        poll: IPolling.PollData
    ) {
        checkGenericQuestion(question, poll, 'scale');
        expect(question.minValue).toBe(0.001);
        expect(question.maxValue).toBe(0.004);
        expect(question.step).toBe(0.001);
    }

    function checkNumberQuestion(
        question: IPolling.QuestionData,
        poll: IPolling.PollData
    ) {
        checkGenericQuestion(question, poll, 'number');
        expect(question.step).toBe(2);
    }

    function checkBooleanQuestion(
        question: IPolling.QuestionData,
        poll: IPolling.PollData
    ) {
        checkGenericQuestion(question, poll, 'boolean');
    }

    function checkGenericQuestion(
        question: IPolling.QuestionData,
        poll: IPolling.PollData,
        type: string,
        visualType?: string
    ) {
        expect(question.id.length > 0).toBe(true);
        expect(question.type).toBe(type);
        expect(question.visualType).toBe(
            typeof visualType === 'string' ? visualType : 'default'
        );
        expect(question.title).toBe('questionTitle');
        expect(question.description).toBe('questionDescription');
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
});
