import * as IPolling from '../../models/IPolling';
import * as IQuestion from '../../models/IQuestion';
import * as IMultiQuestion from '../../models/IMultiQuestion';
import {
    ChildProcessWithoutNullStreams,
    exec,
    ExecException,
    spawn
} from 'child_process';

jest.setTimeout(20000);

describe.skip('integration tests using server api', () => {
    // The tests first create a poll and then this created
    // poll is used for the further tests.
    let createdPoll: IPolling.PollData;

    let serverProcess: ChildProcessWithoutNullStreams;

    // These set how long to wait after booting / shutting down server
    // to give the server time to actually finish starting / shutting down.
    // Depending on how fast your computer is you may need to increase these
    // to give the server process enough time.
    // - Joonas Halinen 31.10.2022
    const bootWait = 10000;
    const shutdownWait = 5000;

    beforeEach(async () => {
        serverProcess = spawn(
            /^win/.test(process.platform) ? 'npm.cmd' : 'npm',
            ['run', 'start']
        );

        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(null);
            }, bootWait);
        });
    });

    afterEach(async () => {
        serverProcess.kill();

        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(null);
            }, shutdownWait);
        });
    });

    describe('create poll', () => {
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
                                \\"type\\": \\"free\\",
                                \\"visualType\\": \\"visual-type\\"
                            },
                            { 
                                \\"title\\": \\"sub-title\\", 
                                \\"description\\": \\"sub-description\\", 
                                \\"type\\": \\"free\\",
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

                console.log(resultJson);

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
            const questionId = (
                createdPoll.questions[0] as IPolling.MultiQuestionData
            ).subQuestions[0].id;

            sendAnswerToFreeQuestion(questionId, 'true', resolve);
        });
        test('send another answer to first sub-question for next tests', (resolve) => {
            const questionId = (
                createdPoll.questions[0] as IPolling.MultiQuestionData
            ).subQuestions[0].id;

            sendAnswerToFreeQuestion(questionId, 'test2', resolve);
        });
        test('send another answer to first sub-question for next tests', (resolve) => {
            const questionId = (
                createdPoll.questions[0] as IPolling.MultiQuestionData
            ).subQuestions[0].id;

            sendAnswerToFreeQuestion(questionId, 'test2', resolve);
        });
        test('send another answer to another sub-question for next tests', (resolve) => {
            const questionId = (
                createdPoll.questions[0] as IPolling.MultiQuestionData
            ).subQuestions[1].id;

            sendAnswerToFreeQuestion(questionId, 'test2', resolve);
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

                    console.log(resultJson);

                    checkPublicPoll(JSON.parse(resultJson));

                    resolve();
                }
            );
        });
    });

    describe.skip('get public poll answers', () => {
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

    describe('get public poll results', () => {
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
    });

    function sendAnswerToFreeQuestion(
        id: string,
        value: string,
        resolve: jest.DoneCallback
    ) {
        const command = `curl -i -X POST -H "Content-Type: application/json" -d "{\\"publicId\\": \\"${createdPoll.publicId}\\", \\"questionId\\": \\"${createdPoll.questions[0].id}\\", \\"answer\\": { \\"subQuestionIds\\": [\\"${id}\\"], \\"answer\\": [ { \\"answer\\": \\"${value}\\" } ] } }" http://localhost:8080/api/poll/${createdPoll.publicId}/answers`;

        exec(command, handleFreeQuestionAnswerResponse.bind(null, resolve));
    }

    function handleFreeQuestionAnswerResponse(
        resolve: jest.DoneCallback,
        err: ExecException | null,
        stdout: string
    ) {
        if (err) {
            throw err;
        }

        const resultJson = extractJson(stdout);

        const result = JSON.parse(resultJson);

        expect(result).toEqual({ success: true });

        resolve();
    }

    function checkResults(results: IPolling.ResultData) {
        expect(results.questions.length).toBe(4);
        expect(Object.keys(results.questions)).toEqual(
            Object.keys(createdPoll.questions)
        );
        checkQuestionResults(results.questions);
    }

    function checkQuestionResults(questions: Array<IQuestion.ResultData>) {
        checkMultiQuestionResults(questions[0] as IMultiQuestion.ResultData);
        checkAnswerlessQuestionResult(questions[1], 'scale');
        checkAnswerlessQuestionResult(questions[2], 'number');
        checkAnswerlessQuestionResult(questions[3], 'boolean');
    }

    function checkMultiQuestionResults(
        multiQuestion: IMultiQuestion.ResultData
    ) {
        checkGenericQuestionResult(multiQuestion);
        expect(multiQuestion.answerCount).toBe(4);
        expect(multiQuestion.answerPercentage).toBe(1);
        expect(multiQuestion.type).toBe('multi');
        expect(multiQuestion.subQuestions.length).toBe(2);
        checkFirstSubQuestionResults(multiQuestion.subQuestions[0]);
        checkSecondSubQuestionResults(multiQuestion.subQuestions[1]);
    }

    function checkFirstSubQuestionResults(question: IQuestion.ResultData) {
        checkGenericSubQuestionResult(question);
        expect(question.answerCount).toBe(3);
        expect(question.answerPercentage).toBe(0.75);
        expect(question.type).toBe('free');
        expect(question.visualType).toBe('visual-type');

        const valueStatisticTrue = {
            value: 'true',
            count: 1,
            percentage: 0.3333333333333333
        };

        const valueStatisticTest2 = {
            value: 'test2',
            count: 2,
            percentage: 0.6666666666666666
        };

        if (question.answerValueStatistics[0].value === 'true') {
            expect(question.answerValueStatistics).toEqual([
                valueStatisticTrue,
                valueStatisticTest2
            ]);
        } else {
            expect(question.answerValueStatistics).toEqual([
                valueStatisticTest2,
                valueStatisticTrue
            ]);
        }
    }

    function checkSecondSubQuestionResults(question: IQuestion.ResultData) {
        checkGenericSubQuestionResult(question);
        expect(question.answerCount).toBe(1);
        expect(question.answerPercentage).toBe(0.25);
        expect(question.type).toBe('free');
        expect(question.visualType).toBe('visual-type');
        expect(question.answerValueStatistics).toEqual([
            {
                value: 'test2',
                count: 1,
                percentage: 1
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

    function checkAnswerlessQuestionResult(
        question: IQuestion.ResultData,
        type: string
    ) {
        checkGenericQuestionResult(question);
        expect(question.answerCount).toBe(0);
        expect(question.answerPercentage).toBe(1);
    }

    function checkAnswers(answers: IPolling.AnswersData) {
        expect(answers.answers.length).toBe(4);

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
        checkGenericQuestion(question, poll, 'multi');
        expect(question.subQuestions.length).toBe(2);
        expect(question.minAnswers).toBe(1);
        expect(question.maxAnswers).toBe(4);

        checkSubQuestion(question.subQuestions[0]);
        checkSubQuestion(question.subQuestions[1]);
    }

    function checkSubQuestion(question: IPolling.QuestionData) {
        expect(question.id.length > 0).toBe(true);
        expect(question.type).toBe('free');
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
        expect(question.step).toBe(0.001);
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
        expect(question.pollId).toBe(poll.id);
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
});
