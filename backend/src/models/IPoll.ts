export interface NewPollData {
    name: string;
    adminLink: string;
    pollLink: string;
    resultLink: string;
    creatorId: string;
}

export interface PollData {
    id: string;
    name: string;
    type?: string;
    pollLink: string;
    adminLink: string;
    creator?: { [prop: string]: any };
    questions?: Array<{ [prop: string]: any }>;
}
