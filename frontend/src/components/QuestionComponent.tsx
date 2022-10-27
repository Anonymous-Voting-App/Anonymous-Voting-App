import React, { useEffect, useState } from 'react';
import {
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper
} from '@mui/material';
import {
    KeyboardArrowDown,
    AddCircleOutline,
    RemoveCircleOutline,
    HighlightOff
} from '@mui/icons-material';
import InputAdornment from '@mui/material/InputAdornment';
import './QuestionComponent.scss';
// import { QUESTION_TYPES } from './constants';

function QuestionComponent(props: any) {
    // console.log(props);
    const [showOptionBtn, setShowOptionBtn] = useState(false);
    const [quesOptions, setQuesOptions] = useState([
        { title: '', description: '', type: '' },
        { title: '', description: '', type: '' }
    ]);
    useEffect(() => {
        setQuesOptions(props.ques.subQuestions);
    }, [props.ques.subQuestions]);

    /**
     * Function to pass entered question text to pollcreation page(parent)
     * @param value
     */
    const onQuestionInput = (value: string) => {
        props.questionInputHandler(value, props.ind);
    };

    /**
     * Function to pass question type to pollcreation page
     * @param value
     */
    const onTypeChange = (value: string) => {
        props.typeChangehandler(value, props.ind);
        setShowOptionBtn(true);
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
    };

    /**
     * Function to update the options array when option text is entered
     * @param index - index of question for which options are added
     * @param value - option text
     */
    const onOptionInput = (index: number, value: string) => {
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
    };

    return (
        <>
            <Paper className="question-wrapper" elevation={3}>
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
                        value={props.ques.type}
                        onChange={(event) => onTypeChange(event.target.value)}
                    >
                        {/* <MenuItem value={''}>
                            <em>None</em>
                        </MenuItem> */}
                        {/* {QUESTION_TYPES.map(item => {
                            return <MenuItem value={item.value}>{item.type}</MenuItem>;
                        })} */}
                        <MenuItem value={'radioBtn'}>Pick one</MenuItem>
                        <MenuItem value={'checkBox'}>Multi - choice</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    autoComplete="off"
                    className="question-field"
                    onChange={(event) => onQuestionInput(event.target.value)}
                    type="text"
                    value={props.ques.title}
                    variant="outlined"
                    inputProps={{ 'data-testid': 'question-field' }}
                    multiline
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <span
                                    className="adornment-span"
                                    onClick={() => removeQuestion()}
                                >
                                    <HighlightOff />
                                </span>
                            </InputAdornment>
                        )
                    }}
                />
                {showOptionBtn ? (
                    <>
                        {quesOptions.map((quesOption, index) => (
                            <TextField
                                inputProps={{
                                    'data-testid': `option-field-${index}`
                                }}
                                className="option-field"
                                InputProps={{
                                    startAdornment: (
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
                                    )
                                }}
                                autoComplete="off"
                                variant="outlined"
                                onChange={(event) =>
                                    onOptionInput(index, event.target.value)
                                }
                                key={index}
                                type="text"
                                value={quesOption.title}
                            />
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

export default QuestionComponent;
