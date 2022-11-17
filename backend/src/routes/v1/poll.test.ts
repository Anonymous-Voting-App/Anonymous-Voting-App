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
                \\"owner\\": { 
                    \\"accountId\\": \\"1eb1cfae-09e7-4456-85cd-e2edfff80544\\", 
                    \\"ip\\": \\"123\\", 
                    \\"cookie\\": \\"c123\\" 
                } 
            }" http://localhost:8080/api/poll`;

            command = formatMultiLineCommandForConsole(command);

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
            const multiQuestion = createdPoll
                .questions[0] as IPolling.MultiQuestionData;
            const scaleQuestion = createdPoll.questions[1];
            const numberQuestion = createdPoll.questions[2];
            const booleanQuestion = createdPoll.questions[3];

            let command = `curl -i -X POST -H "Content-Type: application/json" -d "{
                                    \\"publicId\\": \\"${createdPoll.publicId}\\", 
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
                                        },
                                        {
                                            \\"questionId\\": \\"${booleanQuestion.id}\\",
                                            \\"data\\": {
                                                \\"answer\\": true
                                            }
                                        }
                                    ]
                                }" http://localhost:8080/api/poll/${createdPoll.publicId}/answers`;

            command = formatMultiLineCommandForConsole(command);

            console.log(command);

            exec(command, handleAnswerResponse.bind(null, resolve));
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

    function handleAnswerResponse(
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
        expect(results.answerCount).toBe(1);
        expect(results.questions.length).toBe(4);
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

    function formatMultiLineCommandForConsole(command: string) {
        command = command.replace(/\n/g, '');
        command = command.replace(/\s+/g, ' ');
        command = command.trim();

        return command;
    }
});
