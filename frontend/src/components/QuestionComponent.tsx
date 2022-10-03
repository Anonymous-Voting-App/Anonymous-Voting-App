import React, { useState } from 'react';
import {
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import {
    KeyboardArrowDown,
    AddCircleOutline,
    RemoveCircleOutline
} from '@mui/icons-material';
import InputAdornment from '@mui/material/InputAdornment';

import './QuestionComponent.scss';

function QuestionComponent(props: any) {
    const [showOptionBtn, setShowOptionBtn] = useState(false);
    const [quesOptions, setQuesOptions] = useState(['', '']);
    const [inputWidth, setInputWidth] = useState('260px');

    /**
     * Function to pass entered question text to pollcreation page(parent)
     * @param value
     */
    const onQuestionInput = (value: string) => {
        setInputWidth((value.length + 1) * 8 + 'px'); //dynamically setting the width of question input field
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
        setQuesOptions([...quesOptions, '']);
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
                return value;
            }
            return quesOption;
        });
        setQuesOptions(newOptions);
        props.optionInputHandler(newOptions, props.ind);
    };

    return (
        <>
            <div className="question-wrapper">
                <FormControl
                    className="type-dropdown"
                    sx={{ m: 1, minWidth: 120 }}
                    size="small"
                >
                    <InputLabel id="demo-select-small">
                        Question type
                    </InputLabel>
                    <Select
                        IconComponent={KeyboardArrowDown}
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={props.ques.type}
                        label="Question Type"
                        onChange={(event) => onTypeChange(event.target.value)}
                    >
                        <MenuItem value={''}>
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={'radioBtn'}>Pick One</MenuItem>
                        <MenuItem value={'checkBox'}>Multiple choice</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    sx={{ minWidth: inputWidth }}
                    autoComplete="off"
                    className="question-field"
                    onChange={(event) => onQuestionInput(event.target.value)}
                    type="text"
                    value={props.ques.text}
                    variant="outlined"
                />
                {showOptionBtn ? (
                    <>
                        {quesOptions.map((quesOption, index) => (
                            <TextField
                                className="option-field"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <RemoveCircleOutline
                                                onClick={() =>
                                                    removeOption(index)
                                                }
                                            />
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
                                value={quesOption}
                            />
                        ))}
                        <Button
                            className="add-option-btn"
                            onClick={addOption}
                            sx={{ mt: '4.5rem', width: 200 }}
                            variant="outlined"
                        >
                            <AddCircleOutline />
                            Add a new option
                        </Button>
                    </>
                ) : null}
            </div>
        </>
    );
}

export default QuestionComponent;
