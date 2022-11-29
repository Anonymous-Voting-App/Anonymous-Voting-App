import React from 'react';
import { Typography, TextField, Button, Switch } from '@mui/material';

import './PollEditView.scss';

const PollEditView = () => {
    return (
        <div className="poll-edit-view-wrapper">
            <div className="page-header">
                <Typography variant="h4"> Lunch poll </Typography>
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
                            autoComplete="off"
                            id="name"
                            variant="standard"
                        />
                    </span>
                </div>
                <div className="label-field-container switch-field">
                    <span className="label">
                        <Typography>Show vote count: </Typography>
                    </span>
                    <span className="field">
                        {' '}
                        <Switch className="vote-count-switch" />
                    </span>
                </div>
            </div>
            <Button className="searchButton" variant="outlined">
                Update
            </Button>
        </div>
    );
};

export default PollEditView;
