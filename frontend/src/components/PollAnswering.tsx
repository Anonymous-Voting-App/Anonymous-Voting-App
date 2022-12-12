import React, { useState, useEffect } from 'react';
import { Container, Typography, Button } from '@mui/material';
import './PollAnswering.scss';
import PollAnsweringComponent from './PollAnsweringComponent';
import { fetchPoll, submitPollAnswer } from '../services/pollService';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const PollAnswering = (props: any) => {
    const { pollId } = useParams();
    const navigate = useNavigate();
    const [pollName, setPollName] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState<any>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [pollQuestions, setPollQuestions] = useState<any>([]);
    const [showNext, setsshowNext] = useState(true);
    const [showSubmit, setshowSubmit] = useState(false);

    useEffect(() => {
        getResultData(pollId);
    }, []);

    const getResultData = (id: string | undefined) => {
        if (!id) {
            // console.log('resultData');
            return;
        }
        fetchPoll(id)
            .then((response) => {
                // console.log(response);
                setPollName(response.pollName);
                setPollQuestions(response.questions);
                if (response.questions.length === 1) {
                    setsshowNext(false);
                    setshowSubmit(true);
                }
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

    const NextQuestion = () => {
        setsshowNext(true);
        setshowSubmit(false);
        setCurrentIndex((currentIndex) => currentIndex + 1);
        setCurrentQuestion(pollQuestions[currentIndex + 1]);
        console.log(currentIndex);
        if (currentIndex === pollQuestions.length - 2) {
            setsshowNext(false);
            setshowSubmit(true);
        }
    };

    const PreviousQuestion = () => {
        // console.log('Previous');
        setsshowNext(true);
        setshowSubmit(false);
        setCurrentIndex((currentIndex) => currentIndex - 1);
        setCurrentQuestion(pollQuestions[currentIndex - 1]);
        // if(currentIndex  === pollQuestions.length - 1 ){
        //     setsshowNext(false);
        //     setshowSubmit(true);
        // }
    };

    const handleAddAnswer = (answerObj: any) => {
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
                    case 'upDown':
                        return {
                            ...item,
                            booleanValue: answerObj.booleanValue
                        };
                }
            }
            return item;
        });
        setPollQuestions(updatedQuestions);
        console.log(updatedQuestions, 'updated poll question list');
    };

    const handleSubmit = () => {
        if (localStorage.getItem(pollId!) === null) {
            window.localStorage.setItem(pollId!, pollId!);

            const answers = formatAnswerData(pollQuestions);
            submitPollAnswer(pollId, answers)
                .then((response) => {
                    // 1576d894-2571-4281-933d-431d246bb460
                    if (response.success) {
                        props.showNotification({
                            severity: 'success',
                            message: 'Poll answered submitted successfully'
                        });
                        navigate(`/result/${pollId}`);
                    } else {
                        props.showNotification({
                            severity: 'error',
                            message:
                                'Sorry, An error encountered while submitting your poll answer'
                        });
                    }
                })
                .catch(() => {
                    props.showNotification({
                        severity: 'error',
                        message:
                            'Sorry, An error encountered while creating your poll'
                    });
                });
        } else {
            props.showNotification({
                severity: 'error',
                message: 'You can only answer once'
            });
        }
    };

    const formatAnswerData = (answeredPoll: Array<any>) => {
        console.log(answeredPoll);
        let answerObj: any;
        const updatedQuestions = answeredPoll.map((item: any) => {
            switch (item.type) {
                case 'radioBtn':
                case 'checkBox':
                    console.log(formatMutliTypeAnswer(item));
                    answerObj = formatMutliTypeAnswer(item);
                    break;
                case 'star':
                    answerObj = formatRatingTypeAnswer(item);
                    break;
                case 'free':
                    answerObj = formatFreeTypeAnswer(item);
                    break;
                case 'yesNo':
                case 'upDown':
                    answerObj = formatYesNoTypeAnswer(item);
                    break;
            }
            return answerObj;
        });

        // console.log(updatedQuestions);
        const answerArray = updatedQuestions.filter((answerObj: any) => {
            return answerObj !== null;
        });
        console.log(answerArray);

        return answerArray;
    };

    const formatMutliTypeAnswer = (item: any) => {
        const subQuestionIds = item.options
            .filter((option: any) => option.isSelected === true)
            .map((option: any) => {
                return option.optionId;
            });
        const answer = subQuestionIds.map((obj: any) => {
            return { answer: true };
        });
        const data = {
            subQuestionIds: subQuestionIds,
            answer: answer
        };
        return { questionId: item.quesId, type: 'multi', data: data };
    };

    const formatRatingTypeAnswer = (item: any) => {
        const data = { answer: item.ratingValue };
        return { questionId: item.quesId, type: 'scale', data: data };
    };

    const formatFreeTypeAnswer = (item: any) => {
        const data = { answer: item.freeText };
        return { questionId: item.quesId, type: 'free', data: data };
    };

    // for boolean type ques, item is passed if selection is true else null value is passed
    const formatYesNoTypeAnswer = (item: any) => {
        if (item.booleanValue === 'yes') {
            const data = { answer: true };
            return { questionId: item.quesId, type: 'boolean', data: data };
        } else {
            return null;
        }
    };

    return (
        <Container className="poll-answer-wrapper">
            <Typography className="questionType" variant="h4">
                Poll Name : {pollName}
            </Typography>
            <Typography className="questionType" variant="h4">
                {setQuesType(currentQuestion.type)}
            </Typography>
            <div>
                <PollAnsweringComponent
                    question={currentQuestion}
                    index={currentIndex}
                    addAnswer={handleAddAnswer}
                    total={pollQuestions.length}
                ></PollAnsweringComponent>
            </div>

            <div className="buttonsContainer">
                <Button
                    className="previousQuestionButton"
                    variant="outlined"
                    id="submitButton"
                    onClick={handlePreviousClick}
                    disabled={currentIndex === 0}
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
