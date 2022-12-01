import React from 'react';
import { useLocation } from 'react-router-dom';
import {
    Typography,
    Container,
    FormControlLabel,
    Switch,
    TextField
} from '@mui/material';
import './AdminViewUser.scss';
import { updateUser } from '../services/pollAndUserService';

const AdminViewUser = (props: any) => {
    const location = useLocation();

    const handleUsernameUpdate = (userId: any, username: string) => {
        updateUser(userId, username).then((response) => console.log(response));
    };

    const handleAdminToggle = (userId: any, isAdmin: boolean) => {
        updateUser(userId, isAdmin).then((response) => console.log(response));
    };

    return (
        <Container>
            <Typography className="title" variant="h4">
                Profile
            </Typography>
            <div className="profileContents">
                <div className="row">
                    <Typography className="subtitle">Username:</Typography>
                    <TextField
                        value={location.state.user}
                        onChange={() =>
                            handleUsernameUpdate(
                                location.state.id,
                                location.state.userName
                            )
                        }
                    >
                        {}
                    </TextField>
                </div>
                <div className="userIdRow">
                    <Typography className="subtitle">User ID:</Typography>
                    <Typography>{location.state.id}</Typography>
                </div>
                <div className="row">
                    <FormControlLabel
                        className="adminToggle"
                        control={
                            <Switch
                                sx={{ ml: 7 }}
                                onChange={() =>
                                    handleAdminToggle(
                                        location.state.id,
                                        location.state.isAdmin
                                    )
                                }
                            />
                        }
                        sx={{ ml: 0 }}
                        label={<Typography fontWeight={700}>Admin:</Typography>}
                        labelPlacement="start"
                    />
                </div>
                <div className="row">
                    <Typography className="subtitle">Password:</Typography>
                    <TextField></TextField>
                </div>
            </div>
        </Container>
    );
};

export default AdminViewUser;
