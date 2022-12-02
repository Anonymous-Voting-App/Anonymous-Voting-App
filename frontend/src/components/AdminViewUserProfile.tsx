import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Typography,
    Container,
    Switch,
    TextField,
    Button
} from '@mui/material';
import './AdminViewUserProfile.scss';
import { updateUser } from '../services/userService';
import BasicSnackbar from './BasicSnackbar';

const AdminViewUser = (props: any) => {
    const location = useLocation();
    const [username, setUsername] = useState(location.state.user);
    const [adminToggle, setAdminToggle] = useState(location.state.isAdmin);
    const [newPassword, setNewPassword] = useState('');
    const handleAdminToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAdminToggle(event.target.checked);
    };
    const [open, setOpen] = useState(false);
    const [notificationObj, setNotificationObj] = useState({
        message: '',
        severity: ''
    });

    const navigate = useNavigate();
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
    const handleUpdate = () => {
        updateUser(location.state.id, username, adminToggle, newPassword)
            .then(() => {
                const status = {
                    message: 'Data updated successfully',
                    severity: 'success'
                };
                showSnackBar(status);
                setTimeout(() => {
                    navigate('/admin');
                }, 2000);
            })
            .catch(() => {
                const status = {
                    message: 'Sorry update failed',
                    severity: 'error'
                };
                showSnackBar(status);
            });
    };

    return (
        <Container className="profile-edit-wrapper">
            <Typography className="title" variant="h4">
                Profile
            </Typography>
            <div className="profileContents">
                <div className="label-field-container">
                    <span className="label">
                        <Typography className="subtitle">Username:</Typography>
                    </span>
                    <span className="field field-mui">
                        <TextField
                            autoComplete="off"
                            value={username}
                            variant="standard"
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                        />
                    </span>
                </div>
                <div className="userId label-field-container id-field">
                    <span className="label">
                        <Typography>User ID:</Typography>
                    </span>
                    <span className="field field-mui">
                        <TextField
                            value={location.state.id}
                            autoComplete="off"
                            id="name"
                            variant="standard"
                            disabled
                        />
                    </span>
                </div>
                <div className="label-field-container switch-field">
                    <span className="label">
                        <Typography>Admin: </Typography>
                    </span>
                    <span className="field">
                        {' '}
                        <Switch
                            className="vote-count-switch"
                            onChange={handleAdminToggle}
                            checked={adminToggle}
                        />
                    </span>
                </div>
                <div className="label-field-container password-field">
                    <span className="label">
                        <Typography>New Password:</Typography>
                    </span>
                    <span className="field field-mui">
                        <TextField
                            value={newPassword}
                            autoComplete="off"
                            id="name"
                            variant="standard"
                            onChange={(event) =>
                                setNewPassword(event.target.value)
                            }
                        ></TextField>
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
        </Container>
    );
};

export default AdminViewUser;
