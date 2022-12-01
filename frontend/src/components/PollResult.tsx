import React, { useState, useEffect } from 'react';
import { Container, Link, Typography } from '@mui/material';
import './PollResult.scss';
import { fetchPollResult } from '../services/pollService';
import ResultCard from './ResultCard';

const PollResult = (props: any) => {
    const [pollName, setPollName] = useState('');
    const [pollResult, setPollResult] = useState([]);
    const pollId = window.location.href.substring(
        window.location.href.lastIndexOf('/') + 1
    );
    const [voteStatus, setVoteStatus] = useState('hideVote');
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        getResultData(pollId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getResultData = (id: string) => {
        fetchPollResult(id)
            .then((response) => {
                console.log(response);
                setPollName(response.pollName);
                setPollResult(response.questions);
                setVoteStatus(response.voteCount);
            })
            .catch((error) => {
                // console.log(error);
                setPollName('Oops!! No data fetched');
                props.showNotification({
                    severity: 'error',
                    message:
                        'Sorry, An error encountered while fetching your poll result'
                });
            });
    };
    const handleCopyLink = async (event: any) => {
        console.log('working');
        const pollAnsweringUrl = `${window.location.origin}/result/${pollId}`;
        await navigator.clipboard.writeText(pollAnsweringUrl); //**currently copying link of result page - to be replaced with answering url
        setShowMessage(true);
        // //timer for link copied message
        setTimeout(() => {
            setShowMessage(false);
        }, 500);
        event.stopPropagation();
    };

    return (
        <Container>
            <Typography className="poll-name" variant="h4">
                {pollName}
            </Typography>
            <Link
                href="#"
                className="pinkLink"
                onClick={(e) => handleCopyLink(e)}
            >
                Copy Answering link
            </Link>
            {showMessage ? <div className="messageDiv">Link copied</div> : null}
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
