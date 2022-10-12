import * as IQuestion from './IQuestion';
import * as IAnswer from './IAnswer';

export interface AnswerData {
    subQuestionId: string;
    answer: IQuestion.AnswerData;
    [extra: string]: unknown;
}

export interface DatabaseData {
    id: string;
    title?: string;
    description?: string;
    pollId: string;
    type?: string;
    votes?: Array<IAnswer.DatabaseData>;
    [extra: string]: unknown;
    options?: Array<IQuestion.QuestionDataOptions>;
}

// As this is dependent on Question, export all of its interfaces as well
export * from './IQuestion';
