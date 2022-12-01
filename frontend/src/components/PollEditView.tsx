import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Switch } from '@mui/material';
import './PollEditView.scss';
import { editPoll, getEditPollData } from '../services/pollService';
import BasicSnackbar from './BasicSnackbar';
import { useNavigate } from 'react-router-dom';

const PollEditView = () => {
    const [pollname, setPollName] = useState('');
    const [voteToggle, setVoteToggle] = useState(false);
    const [pollId, setPollId] = useState('');
    const [open, setOpen] = useState(false);
    const [notificationObj, setNotificationObj] = useState({
        message: '',
        severity: ''
    });
    const navigate = useNavigate();
    const privateId = window.location.href.substring(
        window.location.href.lastIndexOf('/') + 1
    );

    useEffect(() => {
        getPollData(privateId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    const showSnackBar = (status: { severity: string; message: string }) => {
        setOpen(true);
        setNotificationObj({
            ...notificationObj,
            message: status.message,
            severity: status.severity
        });
    };

    const handlePollNameChange = (newName: string) => {
        setPollName(newName);
    };

    const handleVoteCount = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVoteToggle(event.target.checked);
    };

    const handleUpdate = () => {
        const voteToggleStatus =
            voteToggle === true ? 'showCount' : 'hideCount';
        editPoll(privateId, pollname, voteToggleStatus)
            .then((response) => {
                console.log(response);
                const status = {
                    message: 'Data updated successfully',
                    severity: 'success'
                };
                showSnackBar(status);
                setTimeout(() => {
                    navigate('/admin');
                }, 2000);
            })
            .catch((error) => {
                const status = {
                    message: 'Sorry update failed',
                    severity: 'error'
                };
                showSnackBar(status);
            });
    };

    const getPollData = (id: string) => {
        getEditPollData(id)
            .then((response) => {
                console.log(response);
                setPollName(response.name);
                setPollId(response.publicId);
                let toggle =
                    response.visualFlags[0] === 'showCount' ? true : false;
                setVoteToggle(toggle);
            })
            .catch((error) => {
                // console.log(error);
                const status = {
                    message: 'Sorry an error occured while fetching data',
                    severity: 'error'
                };
                showSnackBar(status);
            });
    };

    return (
        <div className="poll-edit-view-wrapper">
            <div className="page-header">
                <Typography variant="h4"> {pollname} </Typography>
            </div>
            <div className="edit-info">
                <div className="label-field-container">
                    <span className="label">
                        <Typography>Creator: </Typography>
                    </span>
                    <span className="field field-mui">
                        {' '}
                        <TextField
                            autoComplete="off"
                            id="name"
                            variant="standard"
                            value={pollname}
                            onChange={(event) =>
                                handlePollNameChange(event.target.value)
                            }
                        />
                    </span>
                </div>
                <div className="label-field-container id-field">
                    <span className="label">
                        <Typography>Poll ID: </Typography>
                    </span>
                    <span className="field field-mui">
                        {' '}
                        <TextField
                            value={pollId}
                            autoComplete="off"
                            id="name"
                            variant="standard"
                            disabled
                        />
                    </span>
                </div>
                <div className="label-field-container switch-field">
                    <span className="label">
                        <Typography>Show vote count: </Typography>
                    </span>
                    <span className="field">
                        {' '}
                        <Switch
                            className="vote-count-switch"
                            onChange={handleVoteCount}
                            checked={voteToggle}
                        />
                    </span>
                </div>
            </div>
            <Button
                onClick={handleUpdate}
                className="searchButton"
                variant="outlined"
            >
                Update
            </Button>
            <BasicSnackbar
                open={open}
                onClose={handleClose}
                severity={notificationObj.severity}
                message={notificationObj.message}
            />
        </div>
    );
};

export default PollEditView;
