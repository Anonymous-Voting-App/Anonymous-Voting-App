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
    const [showNext, setsshowNext] = useState(true);
    const [showSubmit, setshowSubmit] = useState(false);
    const [answerArray, setAnswerArray] = useState<any>([]);

    useEffect(() => {
        console.log(pollId);

        getResultData(pollId);
        // 8532e49c-9bbf-419f-b4f7-0a0120d4e35d all
        //76f1e975-4c98-48d4-a06a-1e2e1e7bb409 single mcq
        // 4d31b0f1-d698-4df1-b71d-db971ac8f4da single radioBtn
        // f2a316ae-840c-41ab-9ab2-8efa06b53c55 mcq-pickOne
        // 2739ffac-ad88-4513-817f-53ade4035b56 mcq-pickOne-rating
    }, []);

    const getResultData = (id: string | undefined) => {
        if (!id) {
            // console.log('resultData');
            return;
        }
        fetchPoll(id)
            .then((response) => {
                console.log(response);
                setPollName(response.pollName);
                setQuestions(response.questions);
                console.log(
                    currentIndex,
                    response.questions.length,
                    'CURRENT INDEX'
                );

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
        // console.log('fetchPoll');
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

    const handleNextClick = () => {
        NextQuestion();
    };

    const handlePreviousClick = () => {
        PreviousQuestion();
    };

    const handleSubmit = () => {
        console.log(pollQuestions);
    };

    const NextQuestion = () => {
        setCurrentIndex((currentIndex) => currentIndex + 1);
        setCurrentQuestion(pollQuestions[currentIndex + 1]);
        console.log(currentIndex);
    };

    const PreviousQuestion = () => {
        // console.log('Previous');
        console.log(currentIndex - 1, 'CURRENT INDEX');
        setsshowNext(true);

        setCurrentIndex((currentIndex) => currentIndex - 1);
        setCurrentQuestion(pollQuestions[currentIndex - 1]);
    };

    const handleAddAnswer = (answerObj: any) => {
        console.log(answerObj, 'ANSWER OBJECT');
        const updatedQuestions = pollQuestions.map((item: any) => {
            if (item.quesId === answerObj.quesId) {
                switch (item.type) {
                    case 'radioBtn':
                    case 'checkBox':
                        return { ...item, options: answerObj.options };
                    case 'star':
                        return { ...item, ratingValue: answerObj.ratingValue };
                    case 'free':
                        return { ...item, freeText: answerObj.freeText };
                    case 'yesNo':
                        return { ...item, options: answerObj.options };
                    case 'upDown':
                        return { ...item, options: answerObj.options };
                }
            }
            return item;
        });
        setQuestions(updatedQuestions);
        console.log(updatedQuestions, 'updated poll question list');
    };

    return (
        <Container>
            <Typography className="questionType" variant="h4">
                {setQuesType(currentQuestion.type)}
            </Typography>
            <div>
                <PollAnsweringComponent
                    question={currentQuestion}
                    index={currentIndex}
                    addAnswer={handleAddAnswer}
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
        </Container>
    );
};

export default PollAnswering;
