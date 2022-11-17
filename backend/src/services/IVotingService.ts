import * as IQuestion from '../models/IQuestion';

export interface AnswerData {
    publicId: string;
    answers: Array<IQuestion.Answer>;
}

export interface SuccessObject {
    success: boolean;
}

export type PublicMethod = (
    arg?: number | string | object | boolean
) => Promise<object | null>;
