import React from 'react';
import {
    Container,
    Typography,
    Button,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import './PollAnsweringPage.scss';

const PollAnsweringPage = () => {
    return (
        <Container>
            <Typography className="questionType" variant="h4">
                Pick one:
            </Typography>
            <Typography className="questionTitle">
                What is the best lunch type?
            </Typography>
            <div className="answerContainer">
                <FormControl>
                    <RadioGroup name="answer">
                        <FormControlLabel
                            value="pizza"
                            control={<Radio />}
                            label="Pizza"
                        />
                        <FormControlLabel
                            value="burger"
                            control={<Radio />}
                            label="Burger"
                        />
                    </RadioGroup>
                </FormControl>
            </div>
            <Typography className="questionPage">1 of n questions</Typography>
            <div className="buttonsContainer">
                <Button className="previousQuestionButton" variant="outlined">
                    <ArrowBack />
                    Previous question
                </Button>
                <Button className="nextQuestionButton" variant="outlined">
                    Next question
                    <ArrowForward />
                </Button>
            </div>
        </Container>
    );
};

export default PollAnsweringPage;
