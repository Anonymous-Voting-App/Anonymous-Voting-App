export interface AnswerData {
    answer: any;
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

export interface QuestionData {
    id: string;
    title?: string;
    description?: string;
    pollId: string;
    type?: string;
    votes?: Array<any>;
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
