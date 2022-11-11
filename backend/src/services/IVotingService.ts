import * as IQuestion from '../models/IQuestion';

export interface AnswerData {
    publicId: string;
    answers: Array<IQuestion.Answer>;
    answerer: {
        ip: string;
        cookie: string;
        accountId: string;
    };
}

export interface SuccessObject {
    success: boolean;
}

export type PublicMethod = (
    arg?: number | string | object | boolean
) => Promise<object | null>;
