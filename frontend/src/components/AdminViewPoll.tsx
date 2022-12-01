import React, { useState } from 'react';
import { Typography, Link, Box } from '@mui/material';
import './AdminViewPoll.scss';
import { deletePoll } from '../services/pollAndUserService';

const AdminViewPoll = (props: any) => {
    const [showMessage, setShowMessage] = useState(false);

    const handleViewResult = (pollId: string) => {
        console.log(pollId);
    };

    const handleCopyLink = async (pollId: string) => {
        await navigator.clipboard.writeText(pollId);
        setShowMessage(true);
        //timer for link copied message
        setTimeout(() => {
            setShowMessage(false);
        }, 400);
    };

    const handleDelete = (pollId: string) => {
        // deletePoll(pollId).
        deletePoll(pollId)
            .then((response) => {
                console.log(response.data);
                if (response.success) {
                    console.log('called');
                    props.showNotification({
                        severity: 'success',
                        message: 'Poll deleted successfully'
                    });
                } else {
                    props.showNotification({
                        severity: 'error',
                        message: 'Error occured while deleting poll'
                    });
                }
            })
            .catch((error) => {
                console.log('console.log');
                props.showNotification({
                    severity: 'error',
                    message: 'Error occured while deleting poll'
                });
            });
    };

    return (
        <div className="wrapper-div">
            <Box key={props.pollData.id} className="listItem">
                <Typography>{props.pollData.name}</Typography>
                <Link className="pinkLink" href="#">
                    Edit
                </Link>
                <Link
                    className="pinkLink"
                    onClick={() => handleViewResult(props.pollData.publicId)}
                >
                    View Results
                </Link>
                <Link
                    className="pinkLink"
                    href="#"
                    onClick={() => handleCopyLink(props.pollData.publicId)}
                >
                    Copy link
                </Link>
                <Link
                    className="deleteLink"
                    onClick={() => handleDelete(props.pollData.privateId)}
                    href="#"
                >
                    Delete
                </Link>
            </Box>
            {showMessage ? <div className="messageDiv">Link copied</div> : null}
        </div>
    );
};

export default AdminViewPoll;
