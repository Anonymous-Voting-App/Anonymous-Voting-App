import { PollObj } from '../utils/types';

// function to modify question type before calling api
const updatePollBody = (questions: PollObj[]) => {
    const updatedQuestions = questions.map((element) => {
        console.log(element.type);
        if (element.type === 'radioBtn' || element.type === 'checkBox')
            return { ...element, visualType: element.type, type: 'multi' };
        else return element;
    });
    // console.log(updatedQuestions);
    return updatedQuestions;
};

/**
 * function called when creating a poll
 * @param title
 * @param questions
 * @returns
 */
export const createPoll = async (title: string, questions: any) => {
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
    const response = await fetch(`${window.location.origin}/api/poll`, {
        method: 'POST',
        body: JSON.stringify(pollContent),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    });
    if (response.status !== 201) {
        throw new Error('Request Failed');
    }
    const data = await response.json();
    return data;
};

/**
 * Function for fetching poll result
 * @param pollId
 * @returns
 */
export const fetchPollResult = async (pollId: string) => {
    console.log(pollId, 'poll results');

    const newResponse = await fetch(
        `${window.location.origin}/api/poll/${pollId}/results`,
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
    const formattedData = formatData(dataList);
    console.log(formattedData, 'data');
    return formattedData;
};

/**
 * functions for formatting response data
 * formatData, setQuesArray, formatMultiTypeOptions,
 * formatRatingOptions, formatBooleanOptions
 */
const formatData = (data: any) => {
    const newList = data.questions.map((item: any) => {
        return setQuesArray(item);
    });
    return { pollName: data.name, questions: newList };
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

const formatMultiTypeOptions = (options: [any]) => {
    console.log(options);
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
    // console.log(newArray);
    let ratingTypeOptions = newArray.map((arr) => {
        const obj =
            respOptions.findIndex((option) => option.value === arr.title) === -1
                ? arr
                : respOptions.find((item) => item.value === arr.title);
        return obj;
    });
    console.log(ratingTypeOptions);
    // for fixing title - value keys
    ratingTypeOptions = ratingTypeOptions.map((option) => {
        return {
            title: option.value | option.title,
            count: option.count,
            percentage: Number(option.percentage)
        };
    });
    console.log(ratingTypeOptions);
    return ratingTypeOptions.length > 0 ? ratingTypeOptions : newArray;
};

const formatBooleanOptions = (options: [any]) => {
    const newArray = [
        { title: true, count: 0, percentage: 0 },
        { title: false, count: 0, percentage: 0 }
    ];
    const booleanTypeOptions = options.map((option) => {
        return {
            title: option.value ? 'Yes' : 'No',
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
