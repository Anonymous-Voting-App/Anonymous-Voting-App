import Answer from './Answer';
import User from './User';
import { prismaMock } from '../utils/prisma_singleton';
import { AssertionError } from 'assert';
import { Vote } from '@prisma/client';

jest.mock('./User');

describe('Answer', () => {
    beforeEach(() => {
        jest.resetAllMocks();

        User.prototype.ip = jest.fn().mockReturnValue('test-ip');
        User.prototype.accountId = jest.fn().mockReturnValue('test-accound-id');
        User.prototype.cookie = jest.fn().mockReturnValue('test-cookie');
        User.prototype.id = jest.fn().mockReturnValue('1');
        User.prototype.isIdentifiable = jest.fn().mockReturnValue(true);
    });

    describe('newDatabaseObject', () => {
        test('Create new database object', () => {
            const answer = new Answer();

            answer.setQuestionId('test-question-id');
            answer.setValue('test-value');
            answer.setAnswerer(new User());

            expect(answer.newDatabaseObject()).toEqual({
                questionId: 'test-question-id',
                value: 'test-value',
                voterId: '1'
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
            User.prototype.isIdentifiable = jest
                .fn()
                .mockReturnValueOnce(false);

            const answer = new Answer();

            answer.setValue('test-value');
            answer.setQuestionId('test-question-id');

            const user = new User();

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

    const makeAnswerer = () => {
        const answerer = new User();

        User.prototype.ip = jest.fn().mockReturnValue('test-ip');
        User.prototype.accountId = jest.fn().mockReturnValue('test-accound-id');
        User.prototype.cookie = jest.fn().mockReturnValue('test-cookie');
        User.prototype.id = jest.fn().mockReturnValue('1');

        return answerer;
    };

    const databaseData = () => {
        return {
            id: 'test-id',
            questionId: 'test-question-id',
            value: 'test-value',
            voterId: '1',
            voter: {
                id: '1'
            }
        };
    };
});
