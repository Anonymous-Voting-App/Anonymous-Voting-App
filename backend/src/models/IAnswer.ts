import * as IUser from './IUser';

export interface DatabaseData {
    id: string;
    questionId: string;
    voterId: string;
    voter?: IUser.DatabaseData;
    value: string;
}

export interface NewAnswerData {
    questionId: string;
    value: string;
    voterId: string;
}
