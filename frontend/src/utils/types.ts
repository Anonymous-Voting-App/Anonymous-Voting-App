export interface QuesOptionObj {
    title: string;
    description: string;
    type: string;
}

export interface PollQuesObj {
    title: string;
    description: string;
    visualType: string;
    minAnswers?: number;
    maxAnswers?: number;
    subQuestions: [QuesOptionObj];
}

export interface PollResultObj {
    pollName: string;
    questions: [ResultQuesObj];
}

export interface ResultQuesObj {
    title: string;
    type: string;
    options?: [ResultOptionObj];
    totalCount: number;
    value?: [string];
}

export interface ResultOptionObj {
    count: number;
    title: string | number;
    percentage: number;
}
