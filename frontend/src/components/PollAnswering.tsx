import React, { useState } from 'react';
import {
    Container,
    Typography,
    Rating,
    Button,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    Checkbox,
    TextField
} from '@mui/material';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import './PollAnswering.scss';
//import Question from './Question';

const PollAnswering = (props: any) => {
    const [showPickOne, setshowPickOne] = useState(true);
    const [showMultiChoice, setshowMultiChoice] = useState(false);
    const [showStartRating, setsshowStartRating] = useState(false);
    const [showFreeText, setsshowFreeText] = useState(false);
    const [showYesNo, setsshowYesNo] = useState(false);
    const [showThumbsUpDown, setsshowThumbsUpDown] = useState(false);

    const [showNext, setsshowNext] = useState(true);
    const [showSubmit, setshowSubmit] = useState(false);

    const [QuestionType, setQuestionType] = useState('pickOne');

    //const [questions, setQuestions] = useState([
    //    {
    //        title: '',
    //        description: '',
    //        type: '',
    //        minAnswers: 1,
    //        maxAnswers: 1,
    //        subQuestions: [{ title: '', description: '', type: '' }]
    //    }
    //]);

    const handleNextClick = () => {
        if (QuestionType === 'pickOne') {
            setshowMultiChoice(true);
            setshowPickOne(false);
            setQuestionType('multiChoise');
            (
                document.getElementById('submitButton') as HTMLInputElement
            ).disabled = false;
        } else if (QuestionType === 'multiChoise') {
            setsshowStartRating(true);
            setshowMultiChoice(false);
            setQuestionType('starRating');
        } else if (QuestionType === 'starRating') {
            setsshowStartRating(false);
            setsshowFreeText(true);
            setQuestionType('freeText');
        } else if (QuestionType === 'freeText') {
            setsshowFreeText(false);
            setsshowYesNo(true);
            setQuestionType('YesNo');
        } else if (QuestionType === 'YesNo') {
            setsshowYesNo(false);
            setsshowThumbsUpDown(true);
            setQuestionType('Thumbs');
            setsshowNext(false);
            setshowSubmit(true);
        }

        NextQuestion();
    };

    const handlePreviousClick = () => {
        if (QuestionType === 'multiChoise') {
            setshowMultiChoice(false);
            setshowPickOne(true);
            setQuestionType('pickOne');
            (
                document.getElementById('submitButton') as HTMLInputElement
            ).disabled = true;
        } else if (QuestionType === 'starRating') {
            setsshowStartRating(false);
            setshowMultiChoice(true);
            setQuestionType('multiChoise');
        } else if (QuestionType === 'freeText') {
            setsshowFreeText(false);
            setsshowStartRating(true);
            setQuestionType('starRating');
        } else if (QuestionType === 'YesNo') {
            setsshowYesNo(false);
            setsshowFreeText(true);
            setQuestionType('freeText');
        } else if (QuestionType === 'Thumbs') {
            setsshowThumbsUpDown(false);
            setsshowYesNo(true);
            setQuestionType('YesNo');
            setsshowNext(true);
            setshowSubmit(false);
        }
    };

    const handleSubmit = () => {
        window.location.reload();
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
                                <FormControlLabel
                                    value="option3"
                                    control={<Radio />}
                                    label="Pasta"
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
                            6
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
                            6
                        </Typography>
                        <Typography className="" display="inline">
                            {' '}
                            questions
                        </Typography>
                    </div>
                </div>
            ) : null}

            {showStartRating ? (
                <div className="">
                    <Typography className="questionType" variant="h4">
                        Star rating:
                    </Typography>
                    <Typography className="questionTitle">
                        What rate this vehicle: Car
                    </Typography>
                    <div className="answerContainer">
                        <FormControl>
                            <Rating
                                name="rating-group"
                                sx={{ fontSize: 100 }}
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
                            6
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
                            4
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
                            6
                        </Typography>
                        <Typography className="" display="inline">
                            {' '}
                            questions
                        </Typography>
                    </div>
                </div>
            ) : null}

            {showYesNo ? (
                <div className="">
                    <Typography className="questionType" variant="h4">
                        Yes/No
                    </Typography>
                    <Typography className="questionTitle">
                        Do you use this vehicle: Car
                    </Typography>
                    <div className="buttonsContainer">
                        <Button className="yesnoButton">Yes</Button>
                        <Button className="yesnoButton">No</Button>
                    </div>
                    <div className="questionNumber">
                        <Typography
                            className=""
                            display="inline"
                            id="question_num"
                        >
                            5
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
                            6
                        </Typography>
                        <Typography className="" display="inline">
                            {' '}
                            questions
                        </Typography>
                    </div>
                </div>
            ) : null}

            {showThumbsUpDown ? (
                <div className="">
                    <Typography className="questionType" variant="h4">
                        Thumbs Up/Down:
                    </Typography>
                    <Typography className="questionTitle">
                        Do you like this vehicle: Car
                    </Typography>
                    <div className="answerContainer">
                        <FormControl>
                            <div className="thumbsContainer">
                                <ThumbUpIcon
                                    sx={{ fontSize: 100 }}
                                ></ThumbUpIcon>
                                <ThumbDownIcon
                                    sx={{ fontSize: 100 }}
                                ></ThumbDownIcon>
                            </div>
                        </FormControl>
                    </div>
                    <div className="questionNumber">
                        <Typography
                            className=""
                            display="inline"
                            id="question_num"
                        >
                            6
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
                            6
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
                {showNext ? (
                    <Button
                        className="nextQuestionButton"
                        variant="outlined"
                        onClick={handleNextClick}
                        id="NextButton"
                    >
                        Next question
                        <ArrowForward />
                    </Button>
                ) : null}
                {showSubmit ? (
                    <Button
                        className="nextQuestionButton"
                        variant="outlined"
                        onClick={handleSubmit}
                        id="NextButton"
                    >
                        Submit
                    </Button>
                ) : null}
            </div>
        </Container>
    );
};

export default PollAnswering;
