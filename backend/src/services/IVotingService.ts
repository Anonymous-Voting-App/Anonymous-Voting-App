export interface AnswerData {
    publicId: string;
    questionId: string;
    answer: {
        answer: any;
        [extra: string]: any;
    };
    answerer: {
        ip: string;
        cookie: string;
        accountId: string;
    };
}
