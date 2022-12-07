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
import PollAnsweringComponent from './PollAnsweringComponent';
import { fetchPoll } from '../services/pollService';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useParams } from 'react-router-dom';

const PollAnswering = (props: any) => {
    const { pollId } = useParams();

    const [pollName, setPollName] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState<any>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [pollQuestions, setQuestions] = useState<any>([]);
    const [showMessage, setShowMessage] = useState(false);
    const [voteStatus, setVoteStatus] = useState('hideVote');
    const [pollSize, setPollSize] = useState(0);

    useEffect(() => {
        console.log(pollId);
        getResultData(pollId);
        console.log(currentQuestion.type, 'current q type');
    }, []);

    const getResultData = (id: string | undefined) => {
        if (!id) {
            console.log('resultData');
            return;
        }
        fetchPoll(id)
            .then((response) => {
                console.log(response.questions.length);
                setPollName(response.pollName);
                setQuestions(response.questions);
                setCurrentQuestion(response.questions[currentIndex]);
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

    const [showNext, setsshowNext] = useState(true);
    const [showSubmit, setshowSubmit] = useState(false);

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
        setCurrentIndex((currentIndex) => currentIndex + 1);
        setCurrentQuestion(pollQuestions[currentIndex + 1]);
    };

    const PreviousQuestion = () => {
        console.log('Previous');
        setCurrentIndex((currentIndex) => currentIndex - 1);
        setCurrentQuestion(pollQuestions[currentIndex - 1]);
    };

    return (
        <Container>
            <Typography className="questionType" variant="h4">
                {setQuesType(currentQuestion.type)}
            </Typography>
            <div>
                <PollAnsweringComponent
                    questions={currentQuestion}
                    index={currentIndex}
                ></PollAnsweringComponent>
            </div>

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

            {/* {pollQuestions.map((questions: any, index: any) => (
            <div key={index}>
                <Typography className="questionType" variant="h4">
                    {setQuesType(currentQuestion.type)}
                </Typography>
                <div>
                    <PollAnsweringComponent
                        questions={questions} 
                        index={index}
                    ></PollAnsweringComponent>
                </div>
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
        ))}*/}
        </Container>
    );
};

export default PollAnswering;
