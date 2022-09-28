export interface UserData {
    id: string;

    ip?: string;

    cookie?: string;

    accountId?: string;
}

export interface QuestionData {
    title: string;

    description: string;

    type: string;

    id: string;

    pollId: string;

    answers?: Array<AnswerData>;
}

export interface MultiQuestionData extends QuestionData {
    subQuestions: { [id: string]: QuestionData };
}

export interface AnswerData {
    id: string;

    questionId: string;

    value: any;

    answerer: UserData;
}

export interface PollData {
    id: string;

    name: string;

    type: string;

    publicId: string;

    privateId?: string;

    owner?: UserData;

    questions: { [id: string]: QuestionData };

    answers?: { [id: string]: AnswerData };
}

export interface PollRequest {
    name: string;

    type: string;

    owner: {
        id: string;

        ip: string;

        cookie: string;

        accountId: string;
    };

    questions: Array<QuestionRequest>;
}

export interface QuestionRequest {
    title: string;

    description: string;

    type: string;

    subQuestions?: Array<QuestionRequest>;
}
