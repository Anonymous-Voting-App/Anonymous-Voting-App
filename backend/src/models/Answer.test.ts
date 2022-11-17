import Answer from './Answer';
import User from './user/User';
import { prismaMock } from '../utils/prisma_singleton';
import { AssertionError } from 'assert';
import { Vote } from '@prisma/client';
import Fingerprint from './user/Fingerprint';

jest.mock('./user/User');

describe('Answer', () => {
    beforeEach(() => {
        jest.resetAllMocks();

        Fingerprint.prototype.id = jest.fn().mockReturnValue('1');
        Fingerprint.prototype.isIdentifiable = jest.fn().mockReturnValue(true);
    });

    describe('newDatabaseObject', () => {
        test('Create new database object', () => {
            const answer = new Answer();

            answer.setQuestionId('test-question-id');
            answer.setValue('test-value');
            answer.setAnswerer(makeAnswerer());

            expect(answer.newDatabaseObject()).toEqual({
                questionId: 'test-question-id',
                value: 'test-value',
                voterId: '1',
                parentId: null
            });
        });

        test('Question id not set', () => {
            const answer = new Answer();

            answer.setValue('test-value');
            answer.setAnswerer(makeAnswerer());

            try {
                answer.newDatabaseObject();
                expect(true).toBeFalsy();
            } catch (e: unknown) {
                if (e instanceof AssertionError) {
                    expect(e.message).toBe('questionId is set');
                } else {
                    expect(true).toBeFalsy();
                }
            }
        });

        test('Answerer not set', () => {
            const answer = new Answer();

            answer.setValue('test-value');
            answer.setQuestionId('test-question-id');

            try {
                answer.newDatabaseObject();
                expect(true).toBeFalsy();
            } catch (e: unknown) {
                if (e instanceof AssertionError) {
                    expect(e.message).toBe('answerer is set');
                } else {
                    expect(true).toBeFalsy();
                }
            }
        });

        test('Answerer not identifiable', () => {
            Fingerprint.prototype.isIdentifiable = jest
                .fn()
                .mockReturnValueOnce(false);

            const answer = new Answer();

            answer.setValue('test-value');
            answer.setQuestionId('test-question-id');

            const user = new Fingerprint(prismaMock);

            answer.setAnswerer(user);

            try {
                answer.newDatabaseObject();
                expect(true).toBeFalsy();
            } catch (e: unknown) {
                if (e instanceof AssertionError) {
                    expect(e.message).toBe('answerer is identifiable');
                } else {
                    expect(true).toBeFalsy();
                }
            }
        });
    });

    describe('createNewInDatabase', () => {
        test('Create new answer in database', async () => {
            const mockDbResponse: Vote = {
                id: '1',
                createdAt: new Date(),
                questionId: 'q1',
                parentId: null,
                value: 'asd',
                voterId: 'v1'
            };

            prismaMock.vote.create.mockResolvedValueOnce(mockDbResponse);

            const answer = new Answer();

            answer.setQuestionId('test-question-id');
            answer.setValue('test-value');
            answer.setAnswerer(makeAnswerer());
            answer.setDatabase(prismaMock);

            expect(answer.createdInDatabase()).toBe(false);
            await answer.createNewInDatabase();
            expect(answer.createdInDatabase()).toBe(true);
        });

        test('questionId not set', async () => {
            const answer = new Answer();
            answer.setDatabase(prismaMock);

            try {
                await answer.createNewInDatabase();
                expect(true).toBeFalsy();
            } catch (e: unknown) {
                if (e instanceof AssertionError) {
                    expect(e.message).toBe('questionId is set');
                } else {
                    expect(true).toBeFalsy();
                }
            }
        });
    });

    describe('setFromDatabaseData', () => {
        test('Set answer from database', () => {
            const answer = new Answer();

            answer.setFromDatabaseData(databaseData());

            expect(answer.id()).toBe('test-id');
            expect(answer.questionId()).toBe('test-question-id');
            expect(answer.value()).toBe('test-value');
            expect(answer.answerer().id()).toBe('1');
        });
    });

    describe('isLeafAnswer', () => {
        test('Leaf answer is recognized', () => {
            const answer = new Answer();

            expect(answer.isLeafAnswer()).toBe(true);
        });

        test('Non-leaf-answer is recognized', () => {
            const answer = new Answer();

            answer.subAnswers()['1'] = new Answer();

            expect(answer.isLeafAnswer()).toBe(false);
        });
    });

    describe('leafSubAnswerCount', () => {
        test('One leaf sub-answer and one non-leaf', () => {
            const answer = new Answer();

            answer.subAnswers()['1'] = new Answer();
            answer.subAnswers()['1'].subAnswers()['1-1'] = new Answer();

            answer.subAnswers()['2'] = new Answer();

            expect(answer.leafSubAnswerCount()).toBe(1);
        });

        test('No leaf sub-answers', () => {
            const answer = new Answer();

            answer.subAnswers()['1'] = new Answer();
            answer.subAnswers()['1'].subAnswers()['1-1'] = new Answer();

            expect(answer.leafSubAnswerCount()).toBe(0);
        });
    });

    describe('subAnswerCount', () => {
        test('One leaf sub-answer and one non-leaf', () => {
            const answer = new Answer();

            answer.subAnswers()['1'] = new Answer();
            answer.subAnswers()['1'].subAnswers()['1-1'] = new Answer();

            answer.subAnswers()['2'] = new Answer();

            expect(answer.subAnswerCount()).toBe(2);
        });

        test('One non-leaf sub-answer', () => {
            const answer = new Answer();

            answer.subAnswers()['1'] = new Answer();
            answer.subAnswers()['1'].subAnswers()['1-1'] = new Answer();

            expect(answer.subAnswerCount()).toBe(1);
        });
    });

    const makeAnswerer = () => {
        const answerer = new Fingerprint(prismaMock);

        Fingerprint.prototype.id = jest.fn().mockReturnValue('1');

        return answerer;
    };

    const databaseData = () => {
        return {
            id: 'test-id',
            questionId: 'test-question-id',
            value: 'test-value',
            voterId: '1',
            parentId: null,
            voter: {
                ip: '',
                id: '',
                idCookie: '',
                fingerprintJsId: ''
            }
        };
    };
});
