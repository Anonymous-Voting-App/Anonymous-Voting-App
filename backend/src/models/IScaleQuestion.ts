import * as IQuestion from './IQuestion';

export interface NewQuestionData extends IQuestion.NewQuestionData {
    minValue: number;
    maxValue: number;
}
