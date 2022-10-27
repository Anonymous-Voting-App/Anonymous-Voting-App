import * as IPolling from '../../models/IPolling';
import { ChildProcessWithoutNullStreams, exec, spawn } from 'child_process';

jest.setTimeout(10000);

describe.skip('integration tests using server api', () => {
    // The tests first create a poll and then this created
    // poll is used for the further tests.
    let createdPoll: IPolling.PollData;

    let serverProcess: ChildProcessWithoutNullStreams;

    beforeEach(async () => {
        serverProcess = spawn(
            /^win/.test(process.platform) ? 'npm.cmd' : 'npm',
            ['run', 'start']
        );

        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(null);
            }, 3000);
        });
    });

    afterEach(async () => {
        serverProcess.kill();

        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(null);
            }, 2000);
        });
    });

    describe('api commands', () => {
        test('create poll successfully', (resolve) => {
            let command = `curl -i -X POST -H "Content-Type: application/json" -d "{
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
                                \\"type\\": \\"free\\" 
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
                        \\"step\\": 0.001
                    },
                    { 
                        \\"title\\": \\"questionTitle\\", 
                        \\"description\\": \\"questionDescription\\", 
                        \\"type\\": \\"boolean\\"
                    }
                ], 
                \\"owner\\": { 
                    \\"accountId\\": \\"1eb1cfae-09e7-4456-85cd-e2edfff80544\\", 
                    \\"ip\\": \\"123\\", 
                    \\"cookie\\": \\"c123\\" 
                } 
            }" http://localhost:8080/api/poll`;

            command = command.replace(/\n/g, '');
            command = command.replace(/\s+/g, ' ');
            command = command.trim();

            exec(command, async (err, stdout) => {
                if (err) {
                    throw err;
                }

                const resultJson = extractJson(stdout);

                const poll: IPolling.PollData = JSON.parse(resultJson);

                checkPrivatePoll(poll);

                // Save poll into global for further tests.
                createdPoll = poll;

                resolve();
            });
        });
    });

    describe('answer poll', () => {
        test('answer poll successfully', (resolve) => {
            exec(
                `curl -i -X POST -H "Content-Type: application/json" -d "{\\"publicId\\": \\"${
                    createdPoll.publicId
                }\\", \\"questionId\\": \\"${
                    createdPoll.questions[0].id
                }\\", \\"answer\\": { \\"subQuestionIds\\": [\\"${
                    (createdPoll.questions[0] as IPolling.MultiQuestionData)
                        .subQuestions[0].id
                }\\"], \\"answer\\": [ { \\"answer\\": \\"true\\" } ] } }" http://localhost:8080/api/poll/${
                    createdPoll.publicId
                }/answers`,
                (err, stdout) => {
                    if (err) {
                        throw err;
                    }

                    const resultJson = extractJson(stdout);

                    const result = JSON.parse(resultJson);

                    expect(result).toEqual({ success: true });

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
        expect(answer.value).toBe('');
        expect(typeof answer.answerer).toBe('object');

        checkSubAnswer(answer.subAnswers[0]);
    }

    function checkSubAnswer(subAnswer: IPolling.AnswerData) {
        expect(subAnswer.id.length > 0).toBe(true);
        expect(subAnswer.questionId.length > 0).toBe(true);
        expect(subAnswer.value).toBe('true');
        expect(typeof subAnswer.answerer).toBe('object');
    }

    function checkPrivatePoll(poll: IPolling.PollData) {
        checkPublicPoll(poll);
    }

    function checkPublicPoll(poll: IPolling.PollData) {
        expect(poll.id.length > 0).toBe(true);
        expect(poll.name).toBe('testPoll1');
        expect(poll.questions.length).toBe(4);

        checkMultiQuestion(
            poll.questions[0] as IPolling.MultiQuestionData,
            poll
        );
        checkScaleQuestion(poll.questions[1], poll);
        checkNumberQuestion(poll.questions[2], poll);
        checkBooleanQuestion(poll.questions[3], poll);
    }

    function checkMultiQuestion(
        question: IPolling.MultiQuestionData,
        poll: IPolling.PollData
    ) {
        expect(question.id.length > 0).toBe(true);
        expect(question.subQuestions.length).toBe(1);
        expect(question.pollId).toBe(poll.id);
        expect(question.minAnswers).toBe(1);
        expect(question.maxAnswers).toBe(4);
        expect(question.type).toBe('multi');
        expect(question.title).toBe('questionTitle');
        expect(question.description).toBe('questionDescription');

        checkSubQuestion(question.subQuestions[0]);
    }

    function checkSubQuestion(question: IPolling.QuestionData) {
        expect(question.id.length > 0).toBe(true);
        expect(question.type).toBe('free');
        expect(question.title).toBe('sub-title');
        expect(question.description).toBe('sub-description');
    }

    function checkScaleQuestion(
        question: IPolling.QuestionData,
        poll: IPolling.PollData
    ) {
        expect(question.id.length > 0).toBe(true);
        expect(question.pollId).toBe(poll.id);
        expect(question.type).toBe('scale');
        expect(question.minValue).toBe(0.001);
        expect(question.maxValue).toBe(0.004);
        expect(question.step).toBe(0.001);
        expect(question.title).toBe('questionTitle');
        expect(question.description).toBe('questionDescription');
    }

    function checkNumberQuestion(
        question: IPolling.QuestionData,
        poll: IPolling.PollData
    ) {
        expect(question.id.length > 0).toBe(true);
        expect(question.pollId).toBe(poll.id);
        expect(question.type).toBe('number');
        expect(question.step).toBe(0.001);
        expect(question.title).toBe('questionTitle');
        expect(question.description).toBe('questionDescription');
    }

    function checkBooleanQuestion(
        question: IPolling.QuestionData,
        poll: IPolling.PollData
    ) {
        expect(question.id.length > 0).toBe(true);
        expect(question.pollId).toBe(poll.id);
        expect(question.type).toBe('boolean');
        expect(question.title).toBe('questionTitle');
        expect(question.description).toBe('questionDescription');
    }

    function extractJson(stdout: string): string {
        return '{' + stdout.split('\n{')[1];
    }
});
