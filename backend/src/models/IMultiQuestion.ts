import * as IQuestion from './IQuestion';

export interface AnswerData {
    subQuestionId: string;
    answer: {
        answer: any;
        [extra: string]: unknown;
    };
    [extra: string]: unknown;
}

export interface QuestionData {
    id: string;
    title?: string;
    description?: string;
    pollId: string;
    type: string;
    votes: Array<any>;
    [extra: string]: unknown;
    options?: Array<IQuestion.QuestionDataOptions>;
}

// As this is dependent on Question, export all of its interfaces as well
export * from './IQuestion';
