export interface AnswerData {
    id: string;
    questionId: string;
    voterId: string;
    voter?: any;
    value: string;
}

export interface NewAnswerData {
    questionId: string;
    value: string;
    voterId: string;
}
