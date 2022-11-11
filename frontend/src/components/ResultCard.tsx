import { Button, Paper, Typography } from '@mui/material';
// import React, { useState } from 'react';
import './ResultCard.scss';
import { ResultOptionObj } from '../utils/types';
import ResultOption from './ResultOption';

const ResultCard = (props: any) => {
    // const [options, setOptions] = useState<ResultOptionObj[]>(
    //     props.ques.options
    // );
    const options: ResultOptionObj[] = props.ques.options;
    const handleExport = () => {
        console.log('clicked');
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

    const quesType = setQuesType(props.ques.type);

    // for setting highest flag - tick icon for highest voted options
    const highestCount = options.reduce((prev, current) => {
        return prev.count > current.count ? prev : current;
    });

    return (
        <Paper className="question-wrapper" elevation={3}>
            <Typography className="question-type">{quesType}</Typography>
            <Typography className="question-title">
                {props.ques.title}
            </Typography>
            <div className="options-wrapper">
                {options.map((option, index) => (
                    <div key={index} className="option-row">
                        <ResultOption
                            totalCount={props.ques.totalCount}
                            highestCount={highestCount.count}
                            type={props.ques.type}
                            optionData={option}
                        ></ResultOption>
                    </div>
                ))}
            </div>
            {quesType === 'Free text' ? (
                <Button
                    className="searchButton"
                    variant="outlined"
                    onClick={handleExport}
                >
                    Export Data
                </Button>
            ) : null}
        </Paper>
    );
};

export default ResultCard;
