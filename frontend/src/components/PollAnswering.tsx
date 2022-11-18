import React, { useState } from 'react';
import {
    Container,
    Typography,
    Button,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    checkboxClasses,
    Checkbox,
    TextField
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import './PollAnswering.scss';
import Question from './Question';

const PollAnswering = (props: any) => {
    const [showPickOne, setshowPickOne] = useState(true);
    const [showMultiChoice, setshowMultiChoice] = useState(false);
    const [showFreeText, setsshowFreeText] = useState(false);

    const [IsFirst, setIsFirst] = useState('pickOne');

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

    const handleNextClick = () => {
        if (IsFirst === 'pickOne') {
            setshowMultiChoice(true);
            setshowPickOne(false);
            setIsFirst('multiChoise');
            (
                document.getElementById('submitButton') as HTMLInputElement
            ).disabled = false;
        } else if (IsFirst === 'multiChoise') {
            setsshowFreeText(true);
            setshowMultiChoice(false);
            setIsFirst('freeText');
        }

        (document.getElementById('submitButton') as HTMLInputElement).disabled =
            false;
    };

    const handlePreviousClick = () => {
        if (IsFirst === 'freeText') {
            setshowMultiChoice(true);
            setsshowFreeText(false);
            setIsFirst('multiChoise');
        } else if (IsFirst === 'multiChoise') {
            setshowPickOne(true);
            setshowMultiChoice(false);
            setIsFirst('pickOne');
            (
                document.getElementById('submitButton') as HTMLInputElement
            ).disabled = true;
        }
    };

    const NextQuestion = () => {
        console.log('Next');
    };

    return (
        <Container>
            {showPickOne ? (
                <div className="">
                    <Typography className="questionType" variant="h4">
                        Pick one:
                    </Typography>
                    <Typography className="questionTitle">
                        What is the best lunch type?
                    </Typography>
                    <div className="answerContainer">
                        <FormControl>
                            <RadioGroup name="answer">
                                <FormControlLabel
                                    value="option1"
                                    control={<Radio />}
                                    label="Pizza"
                                />
                                <FormControlLabel
                                    value="option2"
                                    control={<Radio />}
                                    label="Burger"
                                />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className="questionNumber">
                        <Typography
                            className="questionNumberText"
                            display="inline"
                            id="question_num"
                        >
                            1
                        </Typography>
                        <Typography
                            className="questionNumberText"
                            display="inline"
                        >
                            {' '}
                            of{' '}
                        </Typography>
                        <Typography
                            className="questionNumberText"
                            display="inline"
                            id="total_num"
                        >
                            3
                        </Typography>
                        <Typography
                            className="questionNumberText"
                            display="inline"
                        >
                            {' '}
                            questions
                        </Typography>
                    </div>
                </div>
            ) : null}

            {showMultiChoice ? (
                <div className="">
                    <Typography className="questionType" variant="h4">
                        Multi - choice:
                    </Typography>
                    <Typography className="questionTitle">
                        What vehicles do you own?
                    </Typography>
                    <div className="answerContainer">
                        <FormControl>
                            <RadioGroup name="answer">
                                <FormControlLabel
                                    value="option1"
                                    control={<Checkbox />}
                                    label="Car"
                                />
                                <FormControlLabel
                                    value="option2"
                                    control={<Checkbox />}
                                    label="Bike"
                                />
                                <FormControlLabel
                                    value="option3"
                                    control={<Checkbox />}
                                    label="Motor cycle"
                                />
                                <FormControlLabel
                                    value="option4"
                                    control={<Checkbox />}
                                    label="None"
                                />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className="questionNumber">
                        <Typography
                            className=""
                            display="inline"
                            id="question_num"
                        >
                            2
                        </Typography>
                        <Typography className="" display="inline">
                            {' '}
                            of{' '}
                        </Typography>
                        <Typography
                            className=""
                            display="inline"
                            id="total_num"
                        >
                            3
                        </Typography>
                        <Typography className="" display="inline">
                            {' '}
                            questions
                        </Typography>
                    </div>
                </div>
            ) : null}

            {showFreeText ? (
                <div className="">
                    <Typography className="questionType" variant="h4">
                        Free text:
                    </Typography>
                    <Typography className="questionTitle">
                        What kind of vehicle do you use?
                    </Typography>
                    <div className="answerContainer">
                        <FormControl>
                            <TextField
                                fullWidth
                                label="Answer here..."
                                sx={{ width: 500, maxWidth: '100%' }}
                            />
                        </FormControl>
                    </div>
                    <div className="questionNumber">
                        <Typography
                            className=""
                            display="inline"
                            id="question_num"
                        >
                            3
                        </Typography>
                        <Typography className="" display="inline">
                            {' '}
                            of{' '}
                        </Typography>
                        <Typography
                            className=""
                            display="inline"
                            id="total_num"
                        >
                            3
                        </Typography>
                        <Typography className="" display="inline">
                            {' '}
                            questions
                        </Typography>
                    </div>
                </div>
            ) : null}

            <div className="buttonsContainer">
                <Button
                    className="previousQuestionButton"
                    variant="outlined"
                    id="submitButton"
                    onClick={handlePreviousClick}
                >
                    <ArrowBack />
                    Previous question
                </Button>
                <Button
                    className="nextQuestionButton"
                    variant="outlined"
                    onClick={handleNextClick}
                >
                    Next question
                    <ArrowForward />
                </Button>
            </div>
        </Container>
    );
};

export default PollAnswering;
