import { PollQuesObj } from '../utils/types';
import getBackendUrl from '../utils/getBackendUrl';
import { getAuthorizationToken } from '../utils/getAuthorizationToken';

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
            accountId: '7cfe0910-1d65-4321-a589-9dadc2f837eb' // hardcoded
        },
        questions: updatedQuestions,
        visualFlags: [visualFlags]
    };

    const response = await fetch(`${getBackendUrl()}/api/poll`, {
        method: 'POST',
        body: JSON.stringify(pollContent),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: getAuthorizationToken()
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
    // pollId = '1576d894-2571-4281-933d-431d246bb460';
    // a6fb06b2-7146-42c0-820b-346a9d1e0539
    // 63189e12-7a23-4630-8984-5cc2a2629d24 - rating type ques only
    // ee651f25-a6f7-4602-b517-2031396a0b26 - thumbs up/down
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

export const fetchSearchResult = async (
    searchString: string,
    searchType: string
) => {
    const searchBy = searchType === 'poll' ? 'searchByName' : 'searchByID';
    const authToken = getAuthorizationToken();
    let newResponse;

    // const searchBy = 'searchByName';
    // searchString = 'polltest101';
    searchType === 'poll'
        ? (newResponse = await fetch(
              `${getBackendUrl()}/api/poll/admin/${searchBy}/${searchString}`,
              {
                  headers: {
                      'Content-Type': 'application/json',
                      Accept: 'application/json',
                      Authorization: `Bearer ${authToken}`
                  }
              }
          ))
        : (newResponse = await fetch(
              `${getBackendUrl()}/api/user/searchByName/${searchString}`,
              {
                  headers: {
                      'Content-Type': 'application/json',
                      Accept: 'application/json',
                      Authorization: `Bearer ${authToken}`
                  }
              }
          ));

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

export const deleteUser = async (userId: string) => {
    const newResponse = await fetch(`${getBackendUrl()}/api/user/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${getAuthorizationToken()}`
        }
    });

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

export const updateUser = async (
    userId: string,
    username: string,
    adminToggle: boolean,
    newPassword: string
) => {
    const editedUserData = {
        name: username,
        isAdmin: adminToggle,
        password: newPassword
    };
    const response = await fetch(`${getBackendUrl()}/api/user/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(editedUserData),
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${getAuthorizationToken()}`
        }
    });

    if (response.status !== 200) {
        throw new Error('Request Failed');
    }

    const responseJSON = await response.json();
    return responseJSON;
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
