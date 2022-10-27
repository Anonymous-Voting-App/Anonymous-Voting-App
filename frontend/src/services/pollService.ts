import { PollObj } from '../utils/types';

// function to modify question type before calling api
const updatePollBody = (questions: PollObj[]) => {
    const updatedQuestions = questions.map((element) => {
        if (element.type === 'radioBtn' || element.type === 'checkBox')
            return { ...element, type: 'multi' };
        else return element;
    });
    // console.log(updatedQuestions);
    return updatedQuestions;
};

export const createPoll = async (title: string, questions: any) => {
    // console.log(title, questions, 'api called');
    const updatedQuestions = updatePollBody(questions);
    const pollContent = {
        name: title,
        type: 'string',
        owner: {
            accountId: '3fa85f64-5717-4562-b3fc-2c963f66afa6' // hardcoded
        },
        questions: updatedQuestions
    };

    // await fetch(`${window.location.origin}/api/poll`, {
    const response = await fetch('/api/poll', {
        method: 'POST',
        body: JSON.stringify(pollContent),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    });
    // console.log(response.status);
    if (response.status !== 201) {
        throw new Error('Request Failed');
    }
    const data = await response.json();
    return data;
};
