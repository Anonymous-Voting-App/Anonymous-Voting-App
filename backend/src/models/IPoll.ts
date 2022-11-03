import * as IQuestion from './IQuestion';
import * as IUser from './IUser';

export interface FindSelfInDbQuery {
    OR: Array<{ [identifyingProp: string]: string }>;
}

export interface NewDatabaseObject {
    name: string;
    adminLink: string;
    pollLink: string;
    resultLink: string;
    creatorId: string;
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
}
