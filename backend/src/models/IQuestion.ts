import * as IAnswer from './IAnswer';

export interface AnswerData {
    answer: string | number | boolean | object;
    [extra: string]: unknown;
}

export interface NewOptionData {
    option: string;
    questionId: string;
}

export interface NewQuestionData {
    typeId: string;
    pollId: string;
}

export interface OptionData {
    id: string;
    questionId: string;
}

export interface DatabaseData {
    id: string;
    title?: string;
    description?: string;
    pollId: string;
    type?: string;
    votes?: Array<IAnswer.DatabaseData>;
    [extra: string]: unknown;
}

export interface QuestionDataOptions {
    option: string;
    questionId: string;
    id: string;
}

export interface QuestionRequest {
    title: string;
    description: string;
    type: string;
    subQuestions?: Array<QuestionRequest>;
}
