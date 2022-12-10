import React, { useState, useEffect } from 'react';
import { Container, Typography, Button } from '@mui/material';
import './PollAnswering.scss';
import PollAnsweringComponent from './PollAnsweringComponent';
import { fetchPoll } from '../services/pollService';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useParams } from 'react-router-dom';

const PollAnswering = (props: any) => {
    const { pollId } = useParams();

    const [pollName, setPollName] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState<any>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [pollQuestions, setPollQuestions] = useState<any>([]);
    const [showNext, setsshowNext] = useState(true);
    const [showSubmit, setshowSubmit] = useState(false);

    useEffect(() => {
        console.log(pollId);

        getResultData(pollId);
        // 8532e49c-9bbf-419f-b4f7-0a0120d4e35d all
        //76f1e975-4c98-48d4-a06a-1e2e1e7bb409 single mcq
        // 4d31b0f1-d698-4df1-b71d-db971ac8f4da single radioBtn
        // 36370b52-2cdc-4c99-86a4-e2cfff186c6b single freetxt
        // f2a316ae-840c-41ab-9ab2-8efa06b53c55 mcq-pickOne
        // 2739ffac-ad88-4513-817f-53ade4035b56 mcq-pickOne-rating
        //69ded7bc-c818-4538-8dc5-18bbdc69325a mcq-po-star-free
        // f7dc3c8e-1404-430c-9b1a-aedb62f63518  yes/no
        //4eab67de-6710-4f35-95ee-bfadf5319d49 upDown
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
        //implement formatting logic and all question answered condition check
        console.log(pollQuestions);
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
        //     console.log(currentIndex,pollQuestions.length-1,'ci , l-1')
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
