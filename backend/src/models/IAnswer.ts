import * as IUser from './IUser';

export interface DatabaseData {
    id: string;
    questionId: string;
    voterId: string;
    voter?: IUser.DatabaseData;
    parentId: string | null;
    subVotes?: Array<DatabaseData>;
    value: string;
}

export interface NewAnswerData {
    questionId: string;
    value: string;
    voterId: string;
    parentId: string | null;
    subVotes?: Array<NewAnswerData>;
}

export interface Request {
    answer: string | number | boolean | object | Array<Request>;
    [extra: string]: unknown;
}
