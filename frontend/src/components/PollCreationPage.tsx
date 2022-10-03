import { Container, Typography, TextField, Button } from '@mui/material';
import React, { useState } from 'react';
import { ArrowRightAlt, AddCircleOutline } from '@mui/icons-material';
import './PollCreationPage.scss';
import QuestionComponent from './QuestionComponent';

function PollCreationPage() {
    const [showQuesContainer, setShowQuesContainer] = useState(false);
    const [questions, setQuestions] = useState([
        { text: '', type: '', options: [''] }
    ]);
    const [pollName, setPollName] = useState('');

    /**
     * Function to add empty object to array when add question btn is clicked
     */
    const addQuestion = () => {
        setShowQuesContainer(true);

        //    condition check to handle empty question type,
        //    if empty dont increment array
        const isEmpty =
            questions.findIndex(
                (question) =>
                    question.text === '' ||
                    question.type === '' ||
                    (question.options.findIndex((option) => option === '') ===
                    -1
                        ? false
                        : true)
            ) === -1
                ? false
                : true;

        if (!isEmpty) {
            setQuestions([...questions, { text: '', type: '', options: [''] }]);
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
                    text: value,
                    type: question.type,
                    options: question.options
                };
            }
            return question;
        });
        setQuestions(newQuestions);
    };

    /**
     * Function to update question array with question options
     * @param newOptions - array of options for the question
     * @param index - index of question in the array
     */
    const onOptionInput = (newOptions: [string], index: number) => {
        const newQuestions = questions.map((question, questionIndex) => {
            if (questionIndex === index) {
                return {
                    text: question.text,
                    type: question.type,
                    options: newOptions
                };
            }
            return question;
        });
        setQuestions(newQuestions);
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
                    text: question.text,
                    type: value,
                    options: question.options
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
        console.log(questions, pollName);
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
                />
            </div>

            {showQuesContainer ? (
                <div className="question-container">
                    {questions.map((question, index) => (
                        <div key={index}>
                            <QuestionComponent
                                ques={question}
                                ind={index}
                                typeChangehandler={onTypeChange}
                                questionInputHandler={onQuestionInput}
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
            <Button
                variant="contained"
                onClick={submitHandler}
                className="submit-poll-btn"
                sx={{ mt: '4.5rem', width: 200 }}
            >
                {' '}
                Submit Poll{' '}
            </Button>
        </Container>
    );
}

export default PollCreationPage;
