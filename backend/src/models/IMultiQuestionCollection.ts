export interface FindSelfDbQuery {
    where: {
        pollId: string;
    };

    include: {
        options: boolean;
    };
}
