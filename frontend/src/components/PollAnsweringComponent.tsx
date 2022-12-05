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
import './PollAnsweringComponent.scss';
import { fetchPoll } from '../services/pollService';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useParams } from 'react-router-dom';

const PollAnsweringComponent = (props: any) => {
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

    return (
        <Container>
            {props.questions.type === 'checkBox' ? (
                <div className="">
                    <Typography className="questionTitle">
                        {props.questions.title}
                    </Typography>
                    <div className="answerContainer">
                        <FormControl>
                            {/*replace keys with unique values*/}
                            {props.questions.options.map((option: any) => (
                                <RadioGroup name="answer" key="option.title">
                                    <FormControlLabel
                                        value="option.title"
                                        control={<Checkbox />}
                                        label={option.title}
                                    />
                                </RadioGroup>
                            ))}
                        </FormControl>
                    </div>
                </div>
            ) : null}
            {props.questions.type === 'radioBtn' ? (
                <div className="">
                    <Typography className="questionTitle">
                        {props.questions.title}
                    </Typography>
                    <div className="answerContainer">
                        <FormControl>
                            {props.questions.options.map((option: any) => (
                                <RadioGroup name="answer" key="option.title">
                                    <FormControlLabel
                                        value="option3"
                                        control={<Radio />}
                                        label="Label"
                                    />
                                </RadioGroup>
                            ))}
                        </FormControl>
                    </div>
                </div>
            ) : null}
            {/*other types need to be added and I didn't test the pick one*/}
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
                    {props.questions.length}{' '}
                    {console.log(props.questions.length)}
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
