import {
    Container,
    Typography,
    TextField,
    Button,
    FormControlLabel,
    Switch
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { ArrowRightAlt, AddCircleOutline } from '@mui/icons-material';
import './PollCreationPage.scss';
import QuestionComponent from './QuestionComponent';
import { createPoll } from '../services/pollService';

function PollCreationPage(props: any) {
    const [showQuesContainer, setShowQuesContainer] = useState(false);
    const [questions, setQuestions] = useState([
        {
            title: '',
            description: '',
            type: '',
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
                    question.type === '' ||
                    question.subQuestions.length < 2 ||
                    (question.subQuestions.findIndex(
                        (option) => option.title === ''
                    ) === -1
                        ? false
                        : true)
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
                    question.type === '' ||
                    question.subQuestions.length < 2 ||
                    (question.subQuestions.findIndex(
                        (option) => option.title === ''
                    ) === -1
                        ? false
                        : true)
            ) === -1
                ? false
                : true;
        return isEmpty;
    };
    /**
     * Function to add empty object to array when add question btn is clicked
     */
    const addQuestion = () => {
        setShowQuesContainer(true);
        // console.log(questions,'after questions added')
        //    condition check to handle empty question type,
        //    if empty dont increment array
        const isEmpty = emptyFieldCheck();

        if (!isEmpty) {
            setQuestions([
                ...questions,
                {
                    title: '',
                    description: '',
                    type: '',
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
                    type: question.type,
                    minAnswers: 1,
                    maxAnswers:
                        question.type === 'radioBtn'
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
                    type: question.type,
                    subQuestions: newOptions,
                    minAnswers: 1,
                    maxAnswers:
                        question.type === 'radioBtn' ? 1 : newOptions.length
                };
            }
            return question;
        });
        // console.log(newQuestionList);
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
                    type: value,
                    subQuestions: question.subQuestions,
                    minAnswers: 1,
                    maxAnswers:
                        question.type === 'radioBtn'
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

        createPoll(pollName, questions)
            .then((response) => {
                // console.log(response);
                props.showNotification({
                    severity: 'success',
                    message: 'Poll Created successfully'
                });
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
        <Container className="main-wrapper">
            <div className="page-heading">
                <Typography variant="h4"> Create poll </Typography>
                <ArrowRightAlt />
            </div>
            <div className="poll-name">
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
                                <QuestionComponent
                                    ques={question}
                                    ind={index}
                                    typeChangehandler={onTypeChange}
                                    questionInputHandler={onQuestionInput}
                                    questionRemovalHandler={onQuestionRemove}
                                    optionInputHandler={onOptionInput}
                                ></QuestionComponent>
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
        </Container>
    );
}

export default PollCreationPage;
