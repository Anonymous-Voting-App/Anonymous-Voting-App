import * as IQuestion from './IQuestion';
import * as IUser from './user/IUser';

export interface FindSelfInDbQuery {
    OR: Array<{ [identifyingProp: string]: string }>;
}

export interface NewDatabaseObject {
    name: string;
    adminLink: string;
    pollLink: string;
    resultLink: string;
    creatorId: string;
    visualFlags: Array<string>;
}

export interface DatabaseData {
    id: string;
    name: string;
    type?: string;
    pollLink: string;
    adminLink: string;
    creator?: IUser.DatabaseData;
    questions?: Array<IQuestion.DatabaseData>;
    answerCount: number;
    visualFlags: Array<string>;
}
