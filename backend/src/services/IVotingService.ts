export interface AnswerData {
    publicId: string;
    questionId: string;
    answer: {
        answer: number | string | object | boolean;
        [extra: string]: unknown;
    };
    answerer: {
        ip: string;
        cookie: string;
        accountId: string;
    };
}
