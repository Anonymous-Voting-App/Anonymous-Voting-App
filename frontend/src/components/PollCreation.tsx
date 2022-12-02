import {
    Typography,
    TextField,
    Button,
    FormControlLabel,
    Switch
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { ArrowRightAlt, AddCircleOutline } from '@mui/icons-material';
import './PollCreation.scss';
import Question from './Question';
import { createPoll } from '../services/pollAndUserService';
import { PollQuesObj } from '../utils/types';
import { useNavigate } from 'react-router-dom';

function PollCreation(props: any) {
    const navigate = useNavigate();
    const [showQuesContainer, setShowQuesContainer] = useState(false);
    const [questions, setQuestions] = useState<PollQuesObj[]>([
        {
            title: '',
            description: '',
            visualType: '',
            minAnswers: 1,
            maxAnswers: 1,
            subQuestions: [{ title: '', description: '', type: '' }]
        }
    ]);
    const [pollName, setPollName] = useState('');
    const [showCount, setShowCount] = useState(false);
    const [emptyFlag, setEmptyFlag] = useState(true);
    useEffect(() => {
        const isEmpty =
            questions.findIndex(
                (question) =>
                    question.title === '' ||
                    question.visualType === '' ||
                    handleSubQuestionCheck(question)
            ) === -1
                ? false
                : true;
        setEmptyFlag(isEmpty);
    }, [questions]);

    //    condition check to handle empty question type,
    //    if empty dont increment array
    const emptyFieldCheck = () => {
        const isEmpty =
            questions.findIndex(
                (question) =>
                    question.title === '' ||
                    question.visualType === '' ||
                    handleSubQuestionCheck(question) // check returns false if not empty and true if empty
            ) === -1
                ? false
                : true;
        return isEmpty;
    };

    const handleSubQuestionCheck = (question: PollQuesObj) => {
        if (
            question.visualType === 'radioBtn' ||
            question.visualType === 'checkBox'
        ) {
            // returns true if empty false if not empty
            return (
                question.subQuestions.length < 2 ||
                (question.subQuestions.findIndex(
                    (option) => option.title === ''
                ) === -1
                    ? false
                    : true)
            );
        }
        return false;
    };

    /**
     * Function to add empty object to array when add question btn is clicked
     */
    const addQuestion = () => {
        setShowQuesContainer(true);
        //    condition check to handle empty question type,
        //    if empty dont increment array
        const isEmpty = emptyFieldCheck();

        if (!isEmpty) {
            setQuestions([
                ...questions,
                {
                    title: '',
                    description: '',
                    visualType: '',
                    minAnswers: 1,
                    maxAnswers: 1,
                    subQuestions: [{ title: '', description: '', type: '' }]
                }
            ]);
        }
    };

    /**
     * Function to update question array with entered question text
     * @param value - question text
     * @param index - index of question in the array
     */
    const onQuestionInput = (value: string, index: number) => {
        const newQuestions = questions.map((question, questionIndex) => {
            if (questionIndex === index) {
                return {
                    title: value,
                    description: value,
                    visualType: question.visualType,
                    minAnswers: 1,
                    maxAnswers:
                        question.visualType === 'radioBtn'
                            ? 1
                            : question.subQuestions.length,
                    subQuestions: question.subQuestions
                };
            }
            return question;
        });
        setQuestions(newQuestions);
    };

    const onQuestionRemove = (index: number) => {
        const updatedQuestions = questions.filter((item, i) => {
            return i !== index;
        });
        setQuestions(updatedQuestions);
    };

    /**
     * Function to update question array with question options
     * @param newOptions - array of options for the question
     * @param index - index of question in the array
     */
    const onOptionInput = (
        newOptions: [{ title: string; description: string; type: string }],
        index: number
    ) => {
        const newQuestionList = questions.map((question, questionIndex) => {
            if (questionIndex === index) {
                return {
                    title: question.title,
                    description: question.title,
                    visualType: question.visualType,
                    subQuestions: newOptions,
                    minAnswers: 1,
                    maxAnswers:
                        question.visualType === 'radioBtn'
                            ? 1
                            : newOptions.length
                };
            }
            return question;
        });
        setQuestions(newQuestionList);
    };

    /**
     * Function to update question array with question type
     * @param value - question type
     * @param index - index of question in the array
     */
    const onTypeChange = (value: string, index: number) => {
        const newQuestions = questions.map((question, questionIndex) => {
            if (questionIndex === index) {
                return {
                    title: question.title,
                    description: question.description,
                    visualType: value,
                    subQuestions: question.subQuestions,
                    minAnswers: 1,
                    maxAnswers:
                        question.visualType === 'radioBtn'
                            ? 1
                            : question.subQuestions.length
                };
            }
            return question;
        });
        setQuestions(newQuestions);
    };

    /**
     * Function to handle the submit event
     */
    const submitHandler = () => {
        console.log(questions, pollName, showCount);
        const countData = showCount ? 'showCount' : 'hideCount';
        createPoll(pollName, questions, countData)
            .then((response) => {
                // 1576d894-2571-4281-933d-431d246bb460
                props.setPollId(response.publicId); // TO BE REMOVED WHEN ADMIN POLLS IMPLEMENTED
                props.showNotification({
                    severity: 'success',
                    message: 'Poll Created successfully'
                });
                navigate(`result/${response.publicId}`);
            })
            .catch((error) => {
                console.log(error);
                props.showNotification({
                    severity: 'error',
                    message:
                        'Sorry, An error encountered while creating your poll'
                });
            });
    };

    const cancelHandler = () => {
        window.location.reload();
    };

    const handleVoteCount = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowCount(event.target.checked);
    };

    return (
        <div className="main-wrap">
            <div className="page-header">
                <Typography variant="h4"> Create poll </Typography>
                <ArrowRightAlt />
            </div>
            <div className="creation-poll-name">
                <TextField
                    autoComplete="off"
                    id="pollName"
                    label="Poll name"
                    variant="standard"
                    onChange={(event) => setPollName(event.target.value)}
                    inputProps={{ 'data-testid': 'poll-name-field' }}
                />
            </div>
            <div>
                {showQuesContainer ? (
                    <div className="question-container">
                        {questions.map((question, index) => (
                            <div key={index}>
                                <Question
                                    ques={question}
                                    ind={index}
                                    typeChangehandler={onTypeChange}
                                    questionInputHandler={onQuestionInput}
                                    questionRemovalHandler={onQuestionRemove}
                                    optionInputHandler={onOptionInput}
                                ></Question>
                            </div>
                        ))}
                    </div>
                ) : null}

                <Button
                    className="add-ques-btn"
                    onClick={addQuestion}
                    sx={{ mt: '4.5rem', width: 200 }}
                    variant="outlined"
                >
                    <AddCircleOutline />
                    Add a question
                </Button>
            </div>
            <FormControlLabel
                className="vote-count-toggle-btn"
                control={
                    <Switch checked={showCount} onChange={handleVoteCount} />
                }
                label="Show vote count:"
                labelPlacement="start"
                sx={{ mt: '6.25rem', width: 200 }}
            />
            <Button
                disabled={
                    questions.length < 0 ||
                    emptyFlag === true ||
                    pollName === ''
                }
                type="submit"
                variant="contained"
                onClick={submitHandler}
                className="submit-poll-btn"
                sx={{ mt: '1.125rem', width: 200 }}
            >
                {' '}
                Submit Poll{' '}
            </Button>
            <Button
                variant="contained"
                onClick={cancelHandler}
                className="cancel-poll-btn"
            >
                {' '}
                Cancel{' '}
            </Button>
        </div>
    );
}

export default PollCreation;
