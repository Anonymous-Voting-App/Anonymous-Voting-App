import React, { useState, useEffect } from 'react';
import { Container, Link, Typography } from '@mui/material';
import './PollResult.scss';
import { fetchPollResult } from '../services/pollAndUserService';
import ResultCard from './ResultCard';
import { useParams } from 'react-router-dom';

const PollResult = (props: any) => {
    const [pollName, setPollName] = useState('');
    const [pollResult, setPollResult] = useState([]);
    const { pollId } = useParams();
    const [voteStatus, setVoteStatus] = useState('hideVote');
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
                console.log(response);
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
        const pollAnsweringUrl = `${window.location.origin}/result/${pollId}`;
        await navigator.clipboard.writeText(pollAnsweringUrl); //**currently copying link of result page -  answering url has to be added when answering component is implemented
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
                    onClick={(e) => handleResultLink(e)}
                >
                    Copy Answering link
                </Link>
            </div>
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
