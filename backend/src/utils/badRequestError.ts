class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export default BadRequestError;
