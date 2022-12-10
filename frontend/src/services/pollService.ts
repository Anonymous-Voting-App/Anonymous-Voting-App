import { PollQuesObj } from '../utils/types';
import getBackendUrl from '../utils/getBackendUrl';
import { getAuthorizationToken } from '../utils/getAuthorizationToken';
import { getCurrentUser } from '../utils/getCurrentUser';

// function to modify question type before calling api
const updatePollBody = (questions: PollQuesObj[]) => {
    const updatedQuestions = questions.map(
        ({ subQuestions, minAnswers, maxAnswers, ...element }) => {
            let quesObj;
            switch (element.visualType) {
                case 'radioBtn':
                case 'checkBox':
                    quesObj = {
                        type: 'multi',
                        subQuestions: subQuestions,
                        minAnswers: minAnswers,
                        maxAnswers: maxAnswers,
                        ...element
                    };
                    break;
                case 'star':
                    quesObj = {
                        type: 'scale',
                        step: 1,
                        minValue: 1,
                        maxValue: 5,
                        ...element
                    };
                    break;
                case 'yesNo':
                case 'upDown':
                    quesObj = {
                        type: 'boolean',
                        ...element
                    };
                    break;
                case 'free':
                    quesObj = {
                        type: 'free',
                        ...element
                    };
                    break;
            }
            return quesObj;
        }
    );

    return updatedQuestions;
};

/**
 * function called when creating a poll
 * @param title
 * @param questions
 * @returns
 */
export const createPoll = async (
    title: string,
    questions: any,
    visualFlags: string
) => {
    const updatedQuestions = updatePollBody(questions);

    const pollContent = {
        name: title,
        type: 'string',
        owner: {
            accountId: getCurrentUser()?.id
        },
        questions: updatedQuestions,
        visualFlags: [visualFlags]
    };

    const response = await fetch(`${getBackendUrl()}/api/poll`, {
        method: 'POST',
        body: JSON.stringify(pollContent),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${getAuthorizationToken()}`
        }
    });
    if (response.status !== 201) {
        throw new Error('Request Failed');
    }
    const data = await response.json();
    return data;
};

/**
 * Function for fetching poll data for poll answering screen
 * @param pollId
 * @returns
 */
export const fetchPoll = async (pollId: string) => {
    const newResponse = await fetch(`${getBackendUrl()}/api/poll/${pollId}`, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    });

    if (newResponse.status !== 200) {
        console.log('error');
        throw new Error('Request Failed');
    }

    const dataList = await newResponse.json();
    const formattedData = formatPollData(dataList);
    return formattedData;
};

/**
 * Function for fetching poll result
 * @param pollId
 * @returns
 */
export const fetchPollResult = async (pollId: string) => {
    // console.log('8532e49c-9bbf-419f-b4f7-0a0120d4e35d')
    const newResponse = await fetch(
        // `${window.location.origin}/dummy2.json`,
        `${getBackendUrl()}/api/poll/${pollId}/results`,
        {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        }
    );
    if (newResponse.status !== 200) {
        throw new Error('Request Failed');
    }
    const dataList = await newResponse.json();
    console.log(dataList);
    const formattedData = formatData(dataList);

    return formattedData;
};

/**
 * functions for formatting response data
 * formatData, setQuesArray, formatMultiTypeOptions,
 * formatRatingOptions, formatBooleanOptions
 */
const formatData = (data: any) => {
    const newList = data.questions.map((item: any) => {
        console.log(setQuesArray(item));

        return setQuesArray(item);
    });
    return {
        pollName: data.name,
        questions: newList,
        voteCount: data?.visualFlags[0]
    };
};

const setQuesArray = (item: any) => {
    let options;

    switch (item.visualType) {
        case 'radioBtn':
        case 'checkBox':
            const multiOptions = item.subQuestions ? item.subQuestions : [];
            options = formatMultiTypeOptions(multiOptions);
            break;
        case 'star':
            const ratingOptions =
                item.answerValueStatistics?.length > 0
                    ? item.answerValueStatistics
                    : [];
            options = formatRatingOptions(ratingOptions);
            break;
        case 'free':
            options =
                item.answerValueStatistics.length > 0
                    ? formatFreeTextOptions(item.answerValueStatistics)
                    : formatFreeTextOptions(['No feedback']);
            break;
        case 'yesNo':
        case 'upDown':
            const booleanOptions =
                item.answerValueStatistics?.length > 0
                    ? item.answerValueStatistics
                    : [];
            options = formatBooleanOptions(booleanOptions);
            break;
    }
    return {
        title: item.title ? item.title : '',
        type: item.visualType ? item.visualType : 'radioBtn',
        totalCount:
            item.type === 'multi'
                ? item.subQuestions[0].answerCount
                : item.answerCount,
        options: options
    };
};

const formatFreeTextOptions = (options: [any]) => {
    const formattedTextOptions = options.map((option) => {
        return { title: option, count: 0, percenatge: 0 };
    });
    return formattedTextOptions;
};

const formatMultiTypeOptions = (options: [any]) => {
    const formattedOptions = options.map((option) => {
        return {
            title: option.title,
            count: option.trueAnswerCount,
            percentage:
                (option.trueAnswerPercentage * 100)
                    .toFixed(1)
                    .toString()
                    .split('.')[1] === '0'
                    ? Math.round(option.trueAnswerPercentage * 100)
                    : (option.trueAnswerPercentage * 100).toFixed(1)
        };
    });

    return formattedOptions;
};

const formatRatingOptions = (options: [any]) => {
    const respOptions = options.map((option) => {
        return { ...option, percentage: (option.percentage * 100).toFixed(1) };
    });
    const newArray = Array(5)
        .fill({
            title: 0,
            count: 0,
            percentage: 0
        })
        .map((option, index) => {
            return {
                title: index + 1,
                count: 0,
                percentage: 0
            };
        });

    let ratingTypeOptions = newArray.map((arr) => {
        const obj =
            respOptions.findIndex((option) => option.value === arr.title) === -1
                ? arr
                : respOptions.find((item) => item.value === arr.title);
        return obj;
    });
    // for fixing title - value keys
    ratingTypeOptions = ratingTypeOptions.map((option) => {
        return {
            title: option.value | option.title,
            count: option.count,
            percentage: Number(option.percentage)
        };
    });

    return ratingTypeOptions.length > 0
        ? ratingTypeOptions.reverse()
        : newArray;
};

const formatBooleanOptions = (options: [any]) => {
    const newArray = [
        { title: true, count: 0, percentage: 0 },
        { title: false, count: 0, percentage: 0 }
    ];
    const booleanTypeOptions = options.map((option) => {
        return {
            title: option.value === 'true' ? 'Yes' : 'No',
            count: option.count,
            percentage:
                (option.percentage * 100)
                    .toFixed(1)
                    .toString()
                    .split('.')[1] === '0'
                    ? Math.round(option.percentage * 100)
                    : (option.percentage * 100).toFixed(1)
        };
    });

    return booleanTypeOptions.length > 0 ? booleanTypeOptions : newArray;
};

export const fetchSearchPoll = async (searchString: string) => {
    const authToken = getAuthorizationToken();

    const newResponse = await fetch(
        `${getBackendUrl()}/api/poll/admin/searchByName/${searchString}`,
        {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${authToken}`
            }
        }
    );

    if (newResponse.status !== 200) {
        throw new Error('Request Failed');
    }
    const dataList = await newResponse.json();

    return dataList;
};

export const deletePoll = async (pollId: string) => {
    const newResponse = await fetch(
        `${getBackendUrl()}/api/poll/admin/${pollId}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${getAuthorizationToken()}`
            }
        }
    );

    if (newResponse.status !== 200) {
        throw new Error('Request Failed');
    }

    const dataList = await newResponse.json();

    return dataList;
};

export const getEditPollData = async (privateId: string) => {
    const newResponse = await fetch(
        `${getBackendUrl()}/api/poll/admin/${privateId}`,
        {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${getAuthorizationToken()}`
            }
        }
    );

    if (newResponse.status !== 200) {
        throw new Error('Request Failed');
    }
    const dataList = await newResponse.json();

    return dataList;
};

export const editPoll = async (
    privateId: string,
    newName: string,
    showCount: string,
    ownerId: string
) => {
    const editedPollData = {
        name: newName,
        owner: ownerId,
        visualFlags: [showCount]
    };

    const response = await fetch(
        `${getBackendUrl()}/api/poll/admin/${privateId}`,
        {
            method: 'PATCH',
            body: JSON.stringify(editedPollData),
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${getAuthorizationToken()}`
            }
        }
    );

    if (response.status !== 200) {
        throw new Error('Request Failed');
    }
    const data = await response.json();

    return data;
};

/**
 * functions for formatting response data of poll api
 * formatPollData, setQuesArrayForAnswering, formatMultiTypeOptionsWithId,
 */
const formatPollData = (data: any) => {
    const newList = data.questions.map((item: any) => {
        return setQuesArrayForAnswering(item);
    });
    return {
        pollName: data.name,
        questions: newList,
        voteCount: data?.visualFlags[0]
    };
};

const setQuesArrayForAnswering = (item: any) => {
    let options;
    let answer;
    let rating = 0;
    switch (item.visualType) {
        case 'radioBtn':
        case 'checkBox':
            const multiOptions = item.subQuestions ? item.subQuestions : [];
            options = formatMultiTypeOptionsWithId(multiOptions);
            break;
        case 'star':
            options = [];
            break;
        case 'free':
            options = [];
            break;
        case 'yesNo':
            options = [];
            break;
        case 'upDown':
            options = [];
            break;
    }
    return {
        title: item.title ? item.title : '',
        quesId: item.id,
        type: item.visualType ? item.visualType : 'radioBtn',
        answer: answer,
        options: options,
        ratingValue: rating
    };
};

const formatMultiTypeOptionsWithId = (options: [any]) => {
    const formattedOptions = options.map((option) => {
        return {
            optionId: option.id,
            title: option.title,
            isSelected: false
        };
    });

    return formattedOptions;
};
