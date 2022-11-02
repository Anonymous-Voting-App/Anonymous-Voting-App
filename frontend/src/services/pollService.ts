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
    const response = await fetch('http://localhost:8080/api/poll', {
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

export const fetchPollResult = async (pollId: string) => {
    const response = await fetch('http://localhost:3000/dummyApi.json', {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    });
    const data = await response.json();

    return data;
};

export const fetchPollResult2 = async (pollId: string) => {
    const response = await fetch(`http://localhost:8080/api/poll/${pollId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    });
    const data = await response.json();
    const newResponse = await fetch('http://localhost:3000/dummyApi.json', {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    });
    const dataList = await response.json();
    console.log(formatData(dataList));
    return data;
};

const formatData = (data: any) => {
    const newList = data.questions.map((item: any) => {
        setQuesObject(item);
    });

    return { title: data.questions.name, questions: newList };
};

const setQuesObject = (item: any) => {
    let options;
    switch (item.visualType) {
        case 'radioBtn':
        case 'checkBox':
        case 'yes/No':
            return (options = formatMultiTypeOptions(
                item.subQuestions.answerValueStatistics
            ));
        case 'star':
            return (options = formatRatingOptions(item.answerValueStatistics));
    }
    return {
        title: item.title,
        type: item.visualType,
        totalCount: item.answerCount,
        options: options
    };
};

const formatMultiTypeOptions = (options: [any]) => {
    const newOptions = options.map((option) => {
        return {
            title: option.value,
            count: option.count,
            percentage: option.percentage
        };
    });
    return newOptions;
};

const formatRatingOptions = (options: [any]) => {
    let newOptions;
    for (let i = 0; i <= 5; i++) {
        newOptions = options.map((option) => {
            if (option.value === i) {
                return {
                    title: option.value,
                    count: option.count,
                    percentage: option.percentage
                };
            } else {
                return {
                    title: i,
                    count: 0,
                    percentage: 0
                };
            }
        });
    }

    return newOptions;
};
