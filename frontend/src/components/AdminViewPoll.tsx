import React, { useState } from 'react';
import { Typography, Link, Box } from '@mui/material';
import './AdminViewPoll.scss';
import { deletePoll } from '../services/pollService';
import { useNavigate } from 'react-router-dom';

const AdminViewPoll = (props: any) => {
    const navigate = useNavigate();
    const [showMessage, setShowMessage] = useState(false);

    const handleViewResult = (pollId: string) => {
        navigate(`/result/${pollId}`);
    };

    const handleCopyLink = async (pollId: string) => {
        const pollAnsweringUrl = `${window.location.origin}/result/${pollId}`;
        await navigator.clipboard.writeText(pollAnsweringUrl); //**currently copying result page link - to be replaced with answering url
        setShowMessage(true);
        //timer for link copied message
        setTimeout(() => {
            setShowMessage(false);
        }, 400);
    };

    const handleEditView = (privateId: string) => {
        // PrivateID : bc1a638d-8c2b-4403-8f53-3b22e30e8b1e
        navigate(`/admin/polledit/${privateId}`);
    };
    const handleDelete = (pollId: string) => {
        // deletePoll(pollId).
        deletePoll(pollId)
            .then((response) => {
                if (response.success) {
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
            .catch(() => {
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
                <Link
                    className="pinkLink"
                    onClick={() => handleEditView(props.pollData.privateId)}
                >
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
                    Copy Answering link
                </Link>
                <Link
                    className="deleteLink"
                    onClick={() => handleDelete(props.pollData.privateId)}
                >
                    Delete
                </Link>
            </Box>
            {showMessage ? <div className="messageDiv">Link copied</div> : null}
        </div>
    );
};

export default AdminViewPoll;
