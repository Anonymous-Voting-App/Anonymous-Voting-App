import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Rating,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    Checkbox,
    TextField
} from '@mui/material';
import './PollAnsweringComponent.scss';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const PollAnsweringComponent = (props: any) => {
    // console.log(props);
    const [ratingValue, setRatingValue] = useState<number | null>(
        props.question.ratingValue
    );
    const [freeText, setFreeText] = useState<string>(props.question.freeText);
    const [options, setOptions] = useState<any[]>(props.question.options);
    const [booleanValue, setBooleanValue] = useState<string>(
        props.question.booleanValue
    );

    useEffect(() => {
        setFreeText(props.question.freeText);
        setOptions(props.question.options);
        setRatingValue(props.question.ratingValue);
        setBooleanValue(props.question.booleanValue);
    }, [
        props.question.options,
        props.question.ratingValue,
        props.question.freeText,
        props.question.booleanValue
    ]);

    const handleMultiChoiseQuestionAnswer = (option: any) => {
        const updatedOptions = options.map((item: any) => {
            if (item.optionId === option.optionId) {
                return { ...item, isSelected: !item.isSelected };
            }
            return item;
        });
        setOptions(updatedOptions);
        props.addAnswer({
            quesId: props.question.quesId,
            options: updatedOptions
        });
    };

    const handlePickOneQuestionAnswer = (option: any) => {
        // console.log(option);
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

    const handleFreeTextQuestionAnswer = (event: any) => {
        setFreeText(event.target.value);
        // console.log({
        //     quesId: props.question.quesId,
        //     freeText: event.target.value
        // }, 'PASSED TO PARENT')
        props.addAnswer({
            quesId: props.question.quesId,
            freeText: event.target.value
        });
    };

    const handleYesNoQuestionAnswer = (event: any) => {
        setBooleanValue((event.target as HTMLInputElement).value);
        props.addAnswer({
            quesId: props.question.quesId,
            booleanValue: (event.target as HTMLInputElement).value
        });
        // setBooleanValue(val === 'yes' ? true : false);
        // props.addAnswer({
        //     quesId: props.question.quesId,
        //     booleanValue: val === 'yes' ? true : false
        // });
        // val === 'yes' ? setBtnClass({ yesBtnClass: 'yesActive', noBtnClass: '' }) : setBtnClass({ yesBtnClass: '', noBtnClass: 'noActive' })
    };

    return (
        <Container className="answer-component-wrapper">
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
            {/* STAR RATING */}
            {props.question.type === 'star' ? (
                <div className="">
                    <Typography className="questionTitle">
                        {props.question.title}
                    </Typography>
                    <div className="answerContainer">
                        {ratingValue !== undefined ? ( // to render only controlled input element
                            <FormControl className="starContainer">
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
            {/* FREEE */}
            {props.question.type === 'free' ? (
                <div className="">
                    <Typography className="questionTitle">
                        {props.question.title}
                    </Typography>
                    <div className="answerContainer">
                        {freeText !== undefined ? (
                            <FormControl>
                                <TextField
                                    fullWidth
                                    label="Answer here..."
                                    multiline
                                    value={freeText}
                                    sx={{ width: 500, maxWidth: '100%' }}
                                    onChange={(event) =>
                                        handleFreeTextQuestionAnswer(event)
                                    }
                                    className="free-text"
                                />
                            </FormControl>
                        ) : null}
                    </div>
                </div>
            ) : null}
            {/* YESNO */}
            {props.question.type === 'yesNo' ? (
                <div className="">
                    <Typography className="questionTitle">
                        {props.question.title}
                    </Typography>
                    <div className="answerContainer">
                        {booleanValue !== undefined ? (
                            <FormControl>
                                <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={booleanValue}
                                    onChange={(event) =>
                                        handleYesNoQuestionAnswer(event)
                                    }
                                >
                                    <FormControlLabel
                                        value="yes"
                                        control={<Radio />}
                                        label="Yes"
                                    />
                                    <FormControlLabel
                                        value="no"
                                        control={<Radio />}
                                        label="No"
                                    />
                                </RadioGroup>
                            </FormControl>
                        ) : null}
                    </div>
                    {/* <div className="buttonsContainer">
                        <Button onClick={()=>{handleYesNoQuestionAnswer('yes')}} className="yesnoButton">Yes</Button>
                        <Button onClick={()=>{handleYesNoQuestionAnswer('no')}} className="yesnoButton">No</Button>
                    </div> */}
                </div>
            ) : null}
            {/* upDown */}
            {props.question.type === 'upDown' ? (
                <div className="">
                    <Typography className="questionTitle">
                        {props.question.title}
                    </Typography>
                    <div className="answerContainer">
                        {booleanValue !== undefined ? (
                            <FormControl className="updown-container">
                                <RadioGroup
                                    name="controlled-radio-buttons-group"
                                    value={booleanValue}
                                    onChange={(event) =>
                                        handleYesNoQuestionAnswer(event)
                                    }
                                >
                                    <Radio
                                        value="yes"
                                        checkedIcon={
                                            <ThumbUpIcon
                                                sx={{
                                                    fontSize: 40,
                                                    color: 'black'
                                                }}
                                            ></ThumbUpIcon>
                                        }
                                        icon={
                                            <ThumbUpIcon
                                                sx={{ fontSize: 40 }}
                                            ></ThumbUpIcon>
                                        }
                                    />
                                    <Radio
                                        value="no"
                                        checkedIcon={
                                            <ThumbDownIcon
                                                sx={{
                                                    fontSize: 40,
                                                    color: 'black'
                                                }}
                                            ></ThumbDownIcon>
                                        }
                                        icon={
                                            <ThumbDownIcon
                                                sx={{ fontSize: 40 }}
                                            ></ThumbDownIcon>
                                        }
                                    />
                                </RadioGroup>
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
                    {props.total}&nbsp; questions
                </Typography>
            </div>
        </Container>
    );
};

export default PollAnsweringComponent;
