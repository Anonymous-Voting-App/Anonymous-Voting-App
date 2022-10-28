import { Paper, Typography } from '@mui/material';
import React, { useState } from 'react';
import './ResultCard.scss';
import { ResultOptionObj, ResultQuesObj } from '../utils/types';

const ResultCard = (props: any) => {
    console.log(props, 'IN RESULT CARD');
    const [options, setOptions] = useState<ResultOptionObj[] | []>(
        props.ques.options
    );

    return (
        <Paper className="question-wrapper" elevation={3}>
            <Typography className="question-type">{props.ques.type}</Typography>
            <Typography className="question-title">
                {props.ques.title}
            </Typography>
            <div className="options-wrapper">
                {options.map((option, index) => (
                    <div key={index} className="option-row">
                        <Typography>
                            <span className="option-title">
                                {' '}
                                {option.title}{' '}
                            </span>
                            <span className="option-percent">
                                {option.percentage}
                            </span>
                            <span className="option-count">
                                ({option.count}/{option.totalCount})
                            </span>
                        </Typography>
                    </div>
                ))}
            </div>
        </Paper>
    );
};

export default ResultCard;
