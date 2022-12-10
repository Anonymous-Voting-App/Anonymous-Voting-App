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
    TextField,
    FormLabel
} from '@mui/material';
import './PollAnsweringComponent.scss';
import { fetchPoll } from '../services/pollService';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { queryByTestId } from '@testing-library/react';

const PollAnsweringComponent = (props: any) => {
    console.log(props);
    const [question, setQuestion] = useState([]);
    const { pollId } = useParams();
    const [showMessage, setShowMessage] = useState(false);
    const [voteStatus, setVoteStatus] = useState('hideVote');

    const [pollQuestions, setQuestions] = useState([]);
    const [pollSize, setPollSize] = useState(0);

    const [showPickOne, setshowPickOne] = useState(true);
    const [showMultiChoice, setshowMultiChoice] = useState(false);
    const [showStartRating, setsshowStartRating] = useState(false);
    const [showFreeText, setsshowFreeText] = useState(false);
    const [showYesNo, setsshowYesNo] = useState(false);
    const [showThumbsUpDown, setsshowThumbsUpDown] = useState(false);
    const [currentQuestionAnswer, setCurrentQuestionAnswer] = useState<any[]>(
        []
    );
    const [questionAnswers, setQuestionAnswers] = useState<any[]>([]);

    const [ratingValue, setRatingValue] = useState<number | null>(
        props.question.ratingValue
    );
    const [options, setOptions] = useState<any[]>(props.question.options);

    useEffect(() => {
        setOptions(props.question.options);
        setRatingValue(props.question.ratingValue);
    }, [props.question.options, props.question.ratingValue]);

    const handleMultiChoiseQuestionAnswer = (option: any) => {
        const updatedOptions = options.map((item: any) => {
            if (item.optionId === option.optionId) {
                return { ...item, isSelected: !item.isSelected };
            }
            return item;
        });
        setOptions(updatedOptions);
        console.log(updatedOptions);
        console.log({ quesId: props.question.quesId, options: updatedOptions });
        props.addAnswer({
            quesId: props.question.quesId,
            options: updatedOptions
        });
    };

    const handlePickOneQuestionAnswer = (option: any) => {
        console.log(option);
        const updatedOptions = options.map((item: any) => {
            if (item.optionId === option.optionId) {
                return { ...item, isSelected: !item.isSelected };
            }
            return { ...item, isSelected: false };
        });
        setOptions(updatedOptions);
        props.addAnswer({
            quesId: props.question.quesId,
            options: updatedOptions
        });
    };

    const handleRatingQuestionAnswer = (
        event: any,
        newValue: number | null
    ) => {
        setRatingValue(newValue);
        props.addAnswer({
            quesId: props.question.quesId,
            ratingValue: newValue
        });
    };

    console.log('all answers:', questionAnswers);

    return (
        <Container>
            {/* MULTI-CHOIE */}
            {props.question.type === 'checkBox' ? (
                <div className="">
                    <Typography className="questionTitle">
                        {props.question.title}
                    </Typography>
                    {options !== undefined ? (
                        <div className="answerContainer">
                            <FormControl>
                                {options.map((option: any) => (
                                    <FormControlLabel
                                        key={option.optionId}
                                        value={option.title}
                                        control={
                                            <Checkbox
                                                value={option.title}
                                                checked={option.isSelected}
                                                onChange={(e) =>
                                                    handleMultiChoiseQuestionAnswer(
                                                        option
                                                    )
                                                }
                                                color="primary"
                                            />
                                        }
                                        label={option.title}
                                    />
                                ))}
                            </FormControl>
                        </div>
                    ) : null}
                </div>
            ) : null}
            {/* PICK ONE */}
            {props.question.type === 'radioBtn' ? (
                <div className="">
                    <Typography className="questionTitle">
                        {props.question.title}
                    </Typography>
                    {options !== undefined ? (
                        <div className="answerContainer">
                            <FormControl>
                                <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                >
                                    {options.map((option: any) => (
                                        <FormControlLabel
                                            key={option.optionId}
                                            control={
                                                <Radio
                                                    checked={option.isSelected}
                                                    value={option.title}
                                                    onChange={() =>
                                                        handlePickOneQuestionAnswer(
                                                            option
                                                        )
                                                    }
                                                />
                                            }
                                            label={option.title}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </div>
                    ) : null}
                </div>
            ) : null}
            {props.question.type === 'star' ? (
                <div className="">
                    <Typography className="questionTitle">
                        {props.question.title}
                    </Typography>
                    <div className="answerContainer">
                        {ratingValue !== undefined ? ( // to render only controlled input element
                            <FormControl>
                                <Rating
                                    name="simple-controlled"
                                    value={ratingValue}
                                    onChange={(event, newValue) => {
                                        handleRatingQuestionAnswer(
                                            event,
                                            newValue
                                        );
                                    }}
                                />
                            </FormControl>
                        ) : null}
                    </div>
                </div>
            ) : null}

            {/*other types need to be added and I didn't test the pick one*/}
            {/* n of questions */}
            <div className="questionNumber">
                <Typography
                    className="questionNumberText"
                    display="inline"
                    id="question_num"
                >
                    {/*did not test if this works on polls with more than 1 question*/}
                    {props.index + 1}
                </Typography>
                <Typography className="questionNumberText" display="inline">
                    {' '}
                    of{' '}
                </Typography>
                <Typography
                    className="questionNumberText"
                    display="inline"
                    id="total_num"
                >
                    {/*prints correct, but doesn't show up*/}
                    {/* {props.question.length}{' '}
                    {console.log(props.question.length)} */}
                </Typography>
                <Typography className="questionNumberText" display="inline">
                    {' '}
                    questions
                </Typography>
            </div>
            {/* {showMultiChoice ? (
                <div className="">
                    <Typography className="questionTitle">{'Title'}</Typography>
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
                                                            <RadioGroup name="answer">
                                <FormControlLabel
                                    value="option1"
                                    control={<Radio />}
                                    label="Label"
                                />
                                <FormControlLabel
                                    value="option2"
                                    control={<Radio />}
                                    label="Label"
                                />
                                <FormControlLabel
                                    value="option3"
                                    control={<Radio />}
                                    label="Label"
                                />
                            </RadioGroup>
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
                    <Typography className="questionTitle">{'Title'}</Typography>
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
                    <Typography className="questionTitle">{'Title'}</Typography>
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
                    <Typography className="questionTitle">{'Title'}</Typography>
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
                    <Typography className="questionTitle">{'Title'}</Typography>
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
            ) : null} */}
        </Container>
    );
};

export default PollAnsweringComponent;
