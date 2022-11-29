import * as IQuestion from './IQuestion';
import * as IUser from './user/IUser';

export interface QuestionData {
    title: string;
    description: string;
    type: string;
    visualType: string;
    id: string;
    pollId: string;
    answers?: Array<AnswerData>;
    minValue?: number;
    maxValue?: number;
    step?: number;
}

export interface MultiQuestionData extends QuestionData {
    subQuestions: QuestionData[];
    minAnswers: number;
    maxAnswers: number;
}

export interface AnswerData {
    id: string;
    questionId: string;
    value: string | number | boolean | object | null;
    subAnswers: Array<AnswerData>;
}

export interface AnswersData {
    answers: Array<AnswerData>;
}

export interface PollData {
    id: string;
    name: string;
    type: string;
    publicId: string;
    privateId?: string;
    owner?: IUser.PublicData;
    questions: QuestionData[];
    answers?: AnswerData[];
    visualFlags: Array<string>;
}

export interface PollRequest {
    name: string;
    type: string;
    questions: Array<IQuestion.QuestionRequest>;
    visualFlags?: Array<string>;
}

export interface PollEditRequest {
    name?: string;
    owner?: string;
    privateId: string;
    visualFlags?: Array<string>;
}

export interface ResultData {
    name: string;
    type: string;
    publicId: string;
    answerCount: number;
    questions: IQuestion.ResultData[];
    visualFlags: Array<string>;
}
