import React, { useState, useEffect } from 'react';
import { Container, Link, Typography } from '@mui/material';
import './PollResult.scss';
import { fetchPollResult } from '../services/pollService';
import ResultCard from './ResultCard';
import { useParams } from 'react-router-dom';

const PollResult = (props: any) => {
    const [pollName, setPollName] = useState('');
    const [pollResult, setPollResult] = useState([]);
    const { pollId } = useParams();
    const [voteStatus, setVoteStatus] = useState('hideVote');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        getResultData(pollId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getResultData = (id: string | undefined) => {
        if (!id) {
            return;
        }

        fetchPollResult(id)
            .then((response) => {
                setPollName(response.pollName);
                setPollResult(response.questions);
                setVoteStatus(response.voteCount);
            })
            .catch(() => {
                setPollName('Oops!! No data fetched');
                props.showNotification({
                    severity: 'error',
                    message:
                        'Sorry, An error encountered while fetching your poll result'
                });
            });
    };
    const handleResultLink = async (event: any) => {
        const pollResultUrl = `${window.location.origin}/result/${pollId}`;
        await navigator.clipboard.writeText(pollResultUrl);
        setShowMessage(true);
        // //timer for link copied message
        setTimeout(() => {
            setShowMessage(false);
        }, 500);
        event.stopPropagation();
    };

    const handleAnswerLink = async (event: any) => {
        const pollAnswerUrl = `${window.location.origin}/answer/${pollId}`;
        await navigator.clipboard.writeText(pollAnswerUrl);
        setShowMessage(true);
        // //timer for link copied message
        setTimeout(() => {
            setShowMessage(false);
        }, 500);
        event.stopPropagation();
    };

    return (
        <Container className="poll-result-wrapper">
            <Typography className="poll-name" variant="h4">
                {pollName}
            </Typography>
            <div className="link-container">
                <Link
                    href="#"
                    className="pinkLink"
                    onClick={(e) => handleResultLink(e)}
                >
                    Copy Result link
                </Link>
                <Link
                    href="#"
                    className="pinkLink"
                    onClick={(e) => handleAnswerLink(e)}
                >
                    Copy Answering link
                </Link>
            </div>
            {pollResult.length > 0 ? (
                <>
                    {pollResult.map((question, index) => (
                        <div key={index}>
                            <ResultCard
                                ques={question}
                                ind={index}
                                voteStatus={voteStatus}
                            ></ResultCard>
                        </div>
                    ))}
                </>
            ) : null}
        </Container>
    );
};

export default PollResult;
