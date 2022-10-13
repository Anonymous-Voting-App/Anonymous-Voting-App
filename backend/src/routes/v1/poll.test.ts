import * as IPolling from '../../models/IPolling';
import { ChildProcessWithoutNullStreams, exec, spawn } from 'child_process';

jest.setTimeout(20000);

describe.skip('integration tests using server api', () => {
    // The tests first create a poll and then this created
    // poll is used for the further tests.
    let createdPoll: IPolling.PollData;

    let serverProcess: ChildProcessWithoutNullStreams;

    beforeAll(async () => {
        serverProcess = spawn(
            /^win/.test(process.platform) ? 'npm.cmd' : 'npm',
            ['run', 'start']
        );

        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(null);
            }, 10000);
        });
    });

    afterAll(() => {
        serverProcess.kill();
    });

    describe('api commands', () => {
        test('create poll successfully', (resolve) => {
            exec(
                `curl -i -X POST -H "Content-Type: application/json" -d "{\\"name\\": \\"testPoll1\\", \\"type\\": \\"testType\\", \\"questions\\": [ { \\"title\\": \\"questionTitle\\", \\"description\\": \\"questionDescription\\", \\"type:\\": \\"\\", \\"subQuestions\\": [ { \\"title\\": \\"sub-title\\", \\"description\\": \\"sub-description\\", \\"type:\\": \\"\\" } ] } ], \\"owner\\": { \\"accountId\\": \\"1eb1cfae-09e7-4456-85cd-e2edfff80544\\", \\"ip\\": \\"123\\", \\"cookie\\": \\"c123\\" } }" http://localhost:8080/api/poll`,
                async (err, stdout) => {
                    if (err) {
                        throw err;
                    }

                    const resultJson = extractJson(stdout);

                    const poll: IPolling.PollData = JSON.parse(resultJson);

                    checkPrivatePoll(poll);

                    // Save poll into global for further tests.
                    createdPoll = poll;

                    resolve();
                }
            );
        });
    });

    describe('answer poll', () => {
        test('answer poll successfully', (resolve) => {
            exec(
                `curl -i -X POST -H "Content-Type: application/json" -d "{\\"publicId\\": \\"${
                    createdPoll.publicId
                }\\", \\"questionId\\": \\"${
                    createdPoll.questions[0].id
                }\\", \\"answer\\": { \\"subQuestionId\\": \\"${
                    (createdPoll.questions[0] as IPolling.MultiQuestionData)
                        .subQuestions[0].id
                }\\", \\"answer\\": { \\"answer\\": \\"true\\" } } }" http://localhost:8080/api/poll/${
                    createdPoll.publicId
                }/answers`,
                (err, stdout) => {
                    if (err) {
                        throw err;
                    }

                    const resultJson = extractJson(stdout);

                    checkAnswer(JSON.parse(resultJson));

                    resolve();
                }
            );
        });
    });

    describe('get public poll', () => {
        test('get poll with public id', (resolve) => {
            exec(
                `curl -i -X GET http://localhost:8080/api/poll/${createdPoll.publicId}`,
                (err, stdout) => {
                    if (err) {
                        throw err;
                    }

                    const resultJson = extractJson(stdout);

                    checkPublicPoll(JSON.parse(resultJson));

                    resolve();
                }
            );
        });
    });

    describe('get public poll answers', () => {
        test('get poll answers with public id', (resolve) => {
            exec(
                `curl -i -X GET http://localhost:8080/api/poll/${createdPoll.publicId}/answers`,
                (err, stdout) => {
                    if (err) {
                        throw err;
                    }

                    const resultJson = extractJson(stdout);

                    checkAnswers(JSON.parse(resultJson));

                    resolve();
                }
            );
        });
    });

    function checkAnswers(answers: IPolling.AnswersData) {
        expect(answers.answers.length).toBe(1);

        checkAnswer(answers.answers[0]);
    }

    function checkAnswer(answer: IPolling.AnswerData) {
        expect(answer.id.length > 0).toBe(true);
        expect(answer.questionId.length > 0).toBe(true);
        expect(answer.value).toBe('true');
        expect(typeof answer.answerer).toBe('object');
    }

    function checkPrivatePoll(poll: IPolling.PollData) {
        checkPublicPoll(poll);
    }

    function checkPublicPoll(poll: IPolling.PollData) {
        expect(poll.id.length > 0).toBe(true);
        expect(poll.name).toBe('testPoll1');
        expect(poll.questions.length).toBe(1);

        checkQuestion(poll.questions[0] as IPolling.MultiQuestionData, poll);
    }

    function checkQuestion(
        question: IPolling.MultiQuestionData,
        poll: IPolling.PollData
    ) {
        expect(question.id.length > 0).toBe(true);
        expect(question.subQuestions.length).toBe(1);
        expect(question.pollId).toBe(poll.id);

        checkSubQuestion(question.subQuestions[0]);
    }

    function checkSubQuestion(question: IPolling.QuestionData) {
        expect(question.id.length > 0).toBe(true);
    }

    function extractJson(stdout: string): string {
        return '{' + stdout.split('\n{')[1];
    }
});
