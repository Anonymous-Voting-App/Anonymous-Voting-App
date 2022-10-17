import * as IQuestion from './IQuestion';
import * as IAnswer from './IAnswer';

export interface AnswerData {
    subQuestionIds: Array<string>;
    answer: Array<IQuestion.AnswerData>;
    [extra: string]: unknown;
}

export interface DatabaseData {
    id: string;
    title?: string;
    description?: string;
    pollId: string;
    type?: string;
    typeName: string;
    parentId: string | null;
    votes?: Array<IAnswer.DatabaseData>;
    [extra: string]: unknown;
    options?: Array<IQuestion.QuestionDataOptions>;
    subQuestions?: Array<IQuestion.DatabaseData>;
    minValue: number | null;
    maxValue: number | null;
}

// As this is dependent on Question, export all of its interfaces as well
export * from './IQuestion';
