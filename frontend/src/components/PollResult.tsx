import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import './PollResult.scss';
import { fetchPollResult, fetchPollResult2 } from '../services/pollService';
import ResultCard from './ResultCard';

const PollResult = (props: any) => {
    const [pollName, setPollName] = useState('');
    const [pollResult, setPollResult] = useState([]);

    useEffect(() => {
        getResultData('eef61039-cde8-4863-8078-03d3c4bf1174');
    }, []);

    const getResultData = (pollId: string) => {
        fetchPollResult2(pollId)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
                props.showNotification({
                    severity: 'error',
                    message:
                        'Sorry, An error encountered while fetching your poll'
                });
            });

        fetchPollResult(pollId)
            .then((response) => {
                console.log(response);
                setPollName(response.data.pollName);
                setPollResult(response.data.questions);
            })
            .catch((error) => {
                console.log(error);
                // props.showNotification({
                //     severity: 'error',
                //     message:
                //         'Sorry, An error encountered while fetching your poll'
                // });
            });
    };

    return (
        <Container>
            <Typography className="poll-name" variant="h4">
                {pollName}
            </Typography>
            {pollResult.length > 0 ? (
                <>
                    {pollResult.map((question, index) => (
                        <div key={index}>
                            <ResultCard
                                ques={question}
                                ind={index}
                            ></ResultCard>
                        </div>
                    ))}
                </>
            ) : null}
        </Container>
    );
};

export default PollResult;
