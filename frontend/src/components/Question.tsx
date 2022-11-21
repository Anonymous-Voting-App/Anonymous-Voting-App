import React, { useEffect, useState } from 'react';
import {
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    OutlinedInput
} from '@mui/material';
import {
    KeyboardArrowDown,
    AddCircleOutline,
    RemoveCircleOutline,
    HighlightOff,
    Close
} from '@mui/icons-material';
import InputAdornment from '@mui/material/InputAdornment';
import './Question.scss';
import { QUESTION_TYPES } from './constants';

function Question(props: any) {
    const [shrink, setShrink] = useState({ ques: false, option: false });
    const [notched, setNotched] = useState({ ques: false, option: false });
    const [move, setMove] = useState({
        ques: 'move-ques-label',
        option: 'move-option-label'
    }); //'move-label'
    const [showOptionBtn, setShowOptionBtn] = useState(false);
    const [quesOptions, setQuesOptions] = useState([
        { title: '', description: '', type: '' },
        { title: '', description: '', type: '' }
    ]);
    useEffect(() => {
        if (
            props.ques.visualType === 'radioBtn' ||
            props.ques.visualType === 'checkBox'
        ) {
            setShowOptionBtn(true);
        } else {
            setShowOptionBtn(false);
        }
        setQuesOptions(props.ques.subQuestions);
    }, [props.ques.subQuestions, props.ques.visualType]);

    /**
     * Function to pass entered question text to pollcreation page(parent)
     * @param value
     */
    const onQuestionInput = (value: string, type: string) => {
        setShrink({ ...shrink, ques: true });
        setNotched({ ...notched, ques: true });
        setMove({ ...move, ques: 'ques-label' });

        props.questionInputHandler(value, props.ind);
    };

    /**
     * Function to pass question type to pollcreation page
     * @param value
     */
    const onTypeChange = (value: string) => {
        console.log(value);
        props.typeChangehandler(value, props.ind);
        if (value === 'radioBtn' || value === 'checkBox') {
            setShowOptionBtn(true);
        } else {
            setShowOptionBtn(false);
        }
    };

    /**
     * Function to add empty element to the quesOptions
     * array on add option btn click
     */
    const addOption = () => {
        setQuesOptions([
            ...quesOptions,
            { title: '', description: '', type: '' }
        ]);
    };

    /**
     * Function to remove option from quesOptions array
     * @param index - index number of option to be removed
     */
    const removeOption = (index: number) => {
        const newOptions = quesOptions.filter((option, i) => {
            return i !== index;
        });
        setQuesOptions(newOptions);
        props.optionInputHandler(newOptions, props.ind);
        setShrink({ ...shrink, option: true });
        setNotched({ ...notched, option: true });
        setMove({ ...move, option: 'option-label' });
    };

    /**
     * Function to update the options array when option text is entered
     * @param index - index of question for which options are added
     * @param value - option text
     */
    const onOptionInput = (index: number, value: string, type: string) => {
        if (value) {
            setShrink({ ...shrink, option: true });
            setNotched({ ...notched, option: true });
            setMove({ ...move, option: 'option-label' });
        }
        const newOptions = quesOptions.map((quesOption, optionIndex) => {
            if (optionIndex === index) {
                return { title: value, description: value, type: 'boolean' };
            }
            return quesOption;
        });
        setQuesOptions(newOptions);
        props.optionInputHandler(newOptions, props.ind);
    };

    const removeQuestion = () => {
        props.questionRemovalHandler(props.ind);
        // console.log(props, 'props after ques removal');
        setQuesOptions(props.ques.subQuestions);
        setShrink({ ...shrink, option: true });
        setNotched({ ...notched, option: true });
        setMove({ ...move, option: 'option-label' });
    };

    return (
        <>
            <Paper className="question-wrapper main-wrap" elevation={3}>
                <div className="close-icon">
                    <Close onClick={() => removeQuestion()} />
                </div>
                <FormControl
                    className="type-dropdown"
                    sx={{ m: 1, minWidth: 120 }}
                    size="small"
                >
                    <InputLabel id="select-ques-type">Question type</InputLabel>
                    <Select
                        data-testid="ques-type-field"
                        IconComponent={KeyboardArrowDown}
                        labelId="select-ques-type"
                        id="select-ques-type"
                        value={props.ques.visualType}
                        onChange={(event) => onTypeChange(event.target.value)}
                    >
                        {QUESTION_TYPES.map((item) => {
                            return (
                                <MenuItem key={item.value} value={item.value}>
                                    {item.type}
                                </MenuItem>
                            );
                        })}
                        {/* <MenuItem value={'radioBtn'}>Pick one</MenuItem>
                        <MenuItem value={'checkBox'}>Multi - choice</MenuItem> */}
                    </Select>
                </FormControl>
                <FormControl className="question-field">
                    <InputLabel
                        id="question-label"
                        shrink={shrink.ques}
                        className={move.ques}
                    >
                        Enter question
                    </InputLabel>
                    <OutlinedInput
                        notched={notched.ques}
                        label="Enter question"
                        autoComplete="off"
                        onChange={(event) =>
                            onQuestionInput(event.target.value, 'ques')
                        }
                        type="text"
                        value={props.ques.title}
                        inputProps={{ 'data-testid': 'question-field' }}
                        multiline
                        startAdornment={
                            <InputAdornment position="start">
                                <span
                                    className="adornment-span"
                                    onClick={() => removeQuestion()}
                                >
                                    <HighlightOff />
                                </span>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                {showOptionBtn ? (
                    <>
                        {quesOptions.map((quesOption, index) => (
                            <FormControl
                                key={`form-${index}`}
                                className="option-field"
                            >
                                <InputLabel
                                    key={`option-${index}`}
                                    id="option-label"
                                    shrink={shrink.option}
                                    className={move.option}
                                >
                                    Enter option
                                </InputLabel>
                                <OutlinedInput
                                    inputProps={{
                                        'data-testid': `option-field-${index}`
                                    }}
                                    notched={notched.option}
                                    label="Enter option"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <span
                                                className="adornment-span"
                                                data-testid={`option-delete-${index}`}
                                                onClick={() =>
                                                    removeOption(index)
                                                }
                                            >
                                                <RemoveCircleOutline />
                                            </span>
                                        </InputAdornment>
                                    }
                                    autoComplete="off"
                                    onChange={(event) =>
                                        onOptionInput(
                                            index,
                                            event.target.value,
                                            'option'
                                        )
                                    }
                                    key={index}
                                    type="text"
                                    value={quesOption.title}
                                />
                            </FormControl>
                        ))}
                        <Button
                            className="add-option-btn"
                            onClick={addOption}
                            variant="outlined"
                        >
                            <AddCircleOutline />
                            Add a new option
                        </Button>
                    </>
                ) : null}
            </Paper>
        </>
    );
}

export default Question;
