export interface OptionObj {
    title: string;
    description: string;
    type: string;
}

export interface PollObj {
    title: string;
    description: string;
    type: string;
    minAnswer?: number;
    maxAnswer?: number;
    subQuestions: [OptionObj];
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
    title: string;
    percentage: number;
}
