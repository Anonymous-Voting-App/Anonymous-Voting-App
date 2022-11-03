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

export const fetchPollResultDummy = async (pollId: string) => {
    const response = await fetch('http://localhost:3000/dummyApi.json', {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    });
    const data = await response.json();

    return data;
};

export const fetchPollResult = async (pollId: string) => {
    // const response = await fetch(`http://localhost:8080/api/poll/${pollId}`, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         Accept: 'application/json'
    //     }
    // });
    // const data = await response.json();
    const newResponse = await fetch(
        'http://localhost:3000/data_formatted_demo.json',
        {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        }
    );
    const dataList = await newResponse.json();
    console.log(dataList, 'dataList');
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
            const multiOptions = item.subQuestions[0]?.answerValueStatistics
                ? item.subQuestions[0].answerValueStatistics
                : [];
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
            title: option.value,
            count: option.count,
            percentage: (option.percentage * 100).toFixed(1)
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
    const respOptions = options.map((option) => {
        return {
            ...option,
            percentage: Number((option.percentage * 100).toFixed(1))
        };
    });
    const newArray = [
        { title: true, count: 0, percentage: 0 },
        { title: false, count: 0, percentage: 0 }
    ];
    let booleanTypeOptions = newArray.map((arr) => {
        const obj =
            respOptions.findIndex((option) => option.value === arr.title) === -1
                ? arr
                : respOptions.find((op) => op.value === arr.title);
        return obj;
    });
    // for fixing title - value keys
    booleanTypeOptions = booleanTypeOptions.map((option) => {
        return {
            title: option.value | option.title ? 'true' : 'false',
            count: option.count,
            percentage: Number(option.percentage)
        };
    });

    return booleanTypeOptions.length > 0 ? booleanTypeOptions : newArray;
};
