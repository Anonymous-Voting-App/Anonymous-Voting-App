import * as IQuestion from './IQuestion';
import * as IUser from './IUser';

export interface QuestionData {
    title: string;
    description: string;
    type: string;
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
    answerer: IUser.DatabaseData;
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
    owner?: IUser.DatabaseData;
    questions: QuestionData[];
    answers?: AnswerData[];
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
    questions: Array<IQuestion.QuestionRequest>;
}
