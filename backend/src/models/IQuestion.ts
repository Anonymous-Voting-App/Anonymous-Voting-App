import * as IAnswer from './IAnswer';

export interface AnswerData {
    answer: string | number | boolean | object | Array<AnswerData>;
    [extra: string]: unknown;
}

export interface NewOptionData {
    option: string;
    questionId: string;
}

export interface NewQuestionData {
    typeName: string;
    typeId: string;
    pollId: string;
    title: string;
    description: string;
    parentId?: string;
    [extra: string]: unknown;
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
    typeName: string;
    votes?: Array<IAnswer.DatabaseData>;
    parentId: string | null;
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
    minValue?: number;
    maxValue?: number;
    step?: number;
    minAnswers?: number;
    maxAnswers?: number;
    [extra: string]: number | string | object | boolean | undefined;
}
