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
    const [showMultiChoice, setshowMultiChoice] = useState(true);
    const [showStartRating, setsshowStartRating] = useState(true);
    const [showFreeText, setsshowFreeText] = useState(true);
    const [showYesNo, setsshowYesNo] = useState(true);
    const [showThumbsUpDown, setsshowThumbsUpDown] = useState(true);

    //const [QuestionType, setQuestionType] = useState('pickOne');

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
        setshowPickOne(true);
        setshowMultiChoice(false);
        setsshowStartRating(false);
        setsshowFreeText(false);
        setsshowYesNo(false);
        setsshowThumbsUpDown(false);

        NextQuestion();

        (document.getElementById('submitButton') as HTMLInputElement).disabled =
            false;
    };

    const handlePreviousClick = () => {
        setshowPickOne(true);
        setshowMultiChoice(true);
        setsshowStartRating(true);
        setsshowFreeText(true);
        setsshowYesNo(true);
        setsshowThumbsUpDown(true);
        (document.getElementById('submitButton') as HTMLInputElement).disabled =
            true;
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
