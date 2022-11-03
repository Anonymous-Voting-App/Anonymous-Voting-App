import * as IQuestion from './IQuestion';

export interface ResultData extends IQuestion.ResultData {
    trueAnswerCount: number;
    falseAnswerCount: number;
    trueAnswerPercentage: number;
    falseAnswerPercentage: number;
}
