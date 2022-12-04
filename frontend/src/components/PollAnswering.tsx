import React, { useState, useEffect } from 'react';
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
import './PollAnswering.scss';
import { fetchPoll } from '../services/pollService';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useParams } from 'react-router-dom';

const PollAnswering = (props: any) => {
    const [pollName, setPollName] = useState('');
    const [pollQuestions, setQuestions] = useState([]);
    const { pollId } = useParams();
    const [showMessage, setShowMessage] = useState(false);
    const [voteStatus, setVoteStatus] = useState('hideVote');

    const [pollSize, setPollSize] = useState(0);

    useEffect(() => {
        console.log(pollId);
        getResultData(pollId);
    }, []);

    const getResultData = (id: string | undefined) => {
        if (!id) {
            console.log('resultData');
            return;
        }

        fetchPoll(id)
            .then((response) => {
                console.log(response);
                setPollName(response.pollName);
                setQuestions(response.questions);
            })
            .catch(() => {
                setPollName('Oops!! No data fetched');
                props.showNotification({
                    severity: 'error',
                    message:
                        'Sorry, An error encountered while fetching your poll'
                });
            });
        console.log('fetchPoll');
    };

    const setQuesType = (type: string) => {
        switch (type) {
            case 'checkBox':
                return 'Multi-choice';
            case 'radioBtn':
                return 'Pick one';
            case 'star':
                return 'Star rating';
            case 'free':
                return 'Free text';
            case 'yesNo':
                return 'Yes/No';
            case 'upDown':
                return 'Thumbs Up/Down';
            default:
                return 'Pick One';
        }
    };

    const [showPickOne, setshowPickOne] = useState(true);
    const [showMultiChoice, setshowMultiChoice] = useState(false);
    const [showStartRating, setsshowStartRating] = useState(false);
    const [showFreeText, setsshowFreeText] = useState(false);
    const [showYesNo, setsshowYesNo] = useState(false);
    const [showThumbsUpDown, setsshowThumbsUpDown] = useState(false);

    const [showNext, setsshowNext] = useState(true);
    const [showSubmit, setshowSubmit] = useState(false);

    const [questionType, setQuestionType] = useState('Pick One');
    const [currentQuestion, setCurrentQuestion] = useState('1');

    const handleNextClick = () => {
        NextQuestion();
    };

    const handlePreviousClick = () => {
        PreviousQuestion();
    };

    const handleSubmit = () => {
        window.location.reload();
    };

    const NextQuestion = () => {
        console.log('Next');
    };

    const PreviousQuestion = () => {
        console.log('Previous');
    };

    return (
        <Container>
            {pollQuestions.map((question: any, index: any) => (
                <div key={index}>
                    {showPickOne ? (
                        <div className="">
                            <Typography className="questionType" variant="h4">
                                {setQuesType(question.type)}
                            </Typography>
                            <Typography className="questionTitle">
                                {question.title}
                            </Typography>
                            <div className="answerContainer">
                                <FormControl>
                                    <RadioGroup name="answer">
                                        <FormControlLabel
                                            value="option1"
                                            control={<Radio />}
                                            label={question.option}
                                        />
                                        <FormControlLabel
                                            value="option2"
                                            control={<Radio />}
                                            label={question.option}
                                        />
                                        <FormControlLabel
                                            value="option3"
                                            control={<Radio />}
                                            label={question.option}
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
                                    num
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
                                    {question.count}
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
                                {question.type}
                            </Typography>
                            <Typography className="questionTitle">
                                {question.title}
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
                                    num
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
                                    num
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
                                {question.type}
                            </Typography>
                            <Typography className="questionTitle">
                                {question.title}
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
                                    num
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
                                    num
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
                                {question.type}
                            </Typography>
                            <Typography className="questionTitle">
                                {question.title}
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
                                    num
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
                                    num
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
                                {question.type}
                            </Typography>
                            <Typography className="questionTitle">
                                {question.title}
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
                                    num
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
                                    num
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
                                {question.type}
                            </Typography>
                            <Typography className="questionTitle">
                                {question.title}
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
                                    num
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
                                    num
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
                </div>
            ))}
        </Container>
    );
};

export default PollAnswering;
