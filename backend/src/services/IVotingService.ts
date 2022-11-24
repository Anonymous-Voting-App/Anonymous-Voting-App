import * as IQuestion from '../models/IQuestion';
import * as IFingerprint from '../models/user/IFingerprint';

export interface AnswerData {
    publicId: string;
    answers: Array<IQuestion.Answer>;
}

export interface SuccessObject {
    success: boolean;
    fingerprint?: IFingerprint.PrivateData;
}

export type PublicMethod = (
    arg?: number | string | object | boolean
) => Promise<object | null>;
