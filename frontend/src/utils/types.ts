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
