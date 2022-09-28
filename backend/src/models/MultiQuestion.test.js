'use strict';

describe('', () => {
    var MultiQuestion = require('.//MultiQuestion').default;
    var Question = require('.//Question').default;
    var Answer = require('.//Answer').default;
    var testDb = require('../utils/testDb');
    var User = require('.//User').default;

    test('answerDataIsAcceptable happy case', () => {
        var question = new MultiQuestion();

        var subQuestion = new Question();

        subQuestion.setId('sub-id');

        question.subQuestions()[subQuestion.id()] = subQuestion;

        expect(
            question.answerDataIsAcceptable({
                subQuestionId: 'sub-id',

                answer: {
                    answer: 'sub-answer'
                }
            })
        ).toBe(true);

        expect(
            question.answerDataIsAcceptable({
                subQuestionId: 'does-not-exist',

                answer: {
                    answer: 'sub-answer'
                }
            })
        ).toBe(false);
    });

    test('answer happy case', async () => {
        var db = testDb.makeTestDb();

        db.vote = {
            create: function (query) {
                return {
                    id: 'a1',

                    questionId: 'q1',

                    value: 'true'
                };
            }
        };

        var question = new MultiQuestion();

        question.setId('q1');

        var subQuestion = new Question();

        subQuestion.setId('sub-id');

        question.subQuestions()[subQuestion.id()] = subQuestion;

        question.setDatabase(db);

        var user = makeAnswerer();

        var answer = await question.answer(
            {
                subQuestionId: 'sub-id',

                answer: {
                    answer: true
                }
            },
            user
        );

        expect(answer instanceof Answer).toBe(true);

        expect(answer.value()).toBe('true');

        expect(answer.questionId()).toBe('q1');

        expect(answer.answerer()).toBe(user);

        expect(answer.createdInDatabase()).toBe(true);
    });

    test('answer question not found', async () => {
        var question = new MultiQuestion();

        var subQuestion = new Question();

        subQuestion.setId('sub-id');

        question.subQuestions()[subQuestion.id()] = subQuestion;

        question.setDatabase(testDb.makeTestDb());

        var user = makeAnswerer();

        var answer = await question.answer(
            {
                subQuestionId: 'does-not-exist',

                answer: {
                    answer: true
                }
            },
            user
        );

        expect(answer).toBe(null);
    });

    test('answer missing answerData.answer ', async () => {
        var question = new MultiQuestion();

        var subQuestion = new Question();

        subQuestion.setId('sub-id');

        question.subQuestions()[subQuestion.id()] = subQuestion;

        question.setDatabase(testDb.makeTestDb());

        var user = makeAnswerer();

        try {
            var answer = await question.answer(
                {
                    subQuestionId: 'sub-id'
                },
                user
            );

            expect(true).toBe(false);
        } catch (e) {
            expect(e.message).toBe('answerData.answer is of type object');
        }
    });

    test('setFromDatabaseData happy case', () => {
        var question = new MultiQuestion();

        question.setFromDatabaseData({
            id: 'id',

            title: 'title',

            description: 'description',

            pollId: 'pollId',

            type: 'type',

            votes: [],

            options: [
                {
                    id: 'sub-id',

                    questionId: 'id',

                    option: 'option'
                }
            ]
        });

        expect(question.id()).toBe('id');

        /* expect( question.title(  ) ).toBe( "title" );
        
        expect( question.description(  ) ).toBe( "description" ); */

        expect(question.pollId()).toBe('pollId');

        expect(question.type()).toBe('type');

        expect(Object.keys(question.subQuestions())).toEqual(['sub-id']);

        var subQuestion = question.subQuestions()['sub-id'];

        expect(subQuestion.id()).toBe('sub-id');

        expect(subQuestion.title()).toBe('option');

        /* expect( subQuestion.title(  ) ).toBe( "sub-title" );
        
        expect( subQuestion.description(  ) ).toBe( "sub-description" ); */
    });

    test('newDatabaseObject happy case', () => {
        var question = new MultiQuestion();

        question.setId('id');

        question.setType('type');

        question.setDescription('description');

        question.setTitle('title');

        question.setPollId('pollId');

        var subQuestion = new Question();

        subQuestion.setId('sub-id');

        subQuestion.setType('sub-type');

        subQuestion.setDescription('sub-description');

        subQuestion.setTitle('sub-title');

        subQuestion.setPollId('sub-pollId');

        question.subQuestions()[subQuestion.id()] = subQuestion;

        expect(question.newDatabaseObject()).toEqual({
            typeId: '7b76d1c6-8f40-4509-8317-ce444892b1ee',

            /* description: "description",
            
            title: "title", */

            pollId: 'pollId'
        });
    });

    function makeAnswerer() {
        var answerer = new User();

        answerer.setId('1');

        answerer.setIp('test-ip');

        answerer.setAccountId('test-account-id');

        answerer.setCookie('test-cookie');

        answerer.setDatabase(testDb.makeTestDb());

        return answerer;
    }
});
