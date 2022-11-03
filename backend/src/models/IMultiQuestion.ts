import * as IQuestion from './IQuestion';
import * as IAnswer from './IAnswer';

export interface AnswerData {
    subQuestionIds: Array<string>;
    answer: Array<IQuestion.AnswerData>;
    [extra: string]: unknown;
}

export interface DatabaseData extends IQuestion.DatabaseData {
    options?: Array<IQuestion.QuestionDataOptions>;
    subQuestions?: Array<IQuestion.DatabaseData>;
    minValue: number | null;
    maxValue: number | null;
}

export interface ResultData extends IQuestion.ResultData {
    subQuestions: Array<IQuestion.ResultData>;
}

// As this is dependent on Question, export all of its interfaces as well
export * from './IQuestion';
