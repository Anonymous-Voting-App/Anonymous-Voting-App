import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Typography,
    Link,
    Container,
    FormControlLabel,
    Switch,
    TextField
} from '@mui/material';
import './AdminViewUser.scss';

const AdminViewUser = (props: any) => {
    const location = useLocation();

    const [usernameEditDisabled, setUsernameEditDisabled] = useState(true);

    const handleAdminToggle = () => {
        console.log('toggled');
    };

    const handleUsernameEdit = () => {
        setUsernameEditDisabled(!usernameEditDisabled);
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
                        value={location.state.username}
                        disabled={usernameEditDisabled}
                    >
                        {}
                    </TextField>
                </div>
                <div className="userIdRow">
                    <Typography className="subtitle">User ID:</Typography>
                    <Typography>12345</Typography>
                </div>
                <div className="row">
                    <FormControlLabel
                        className="adminToggle"
                        control={
                            <Switch
                                sx={{ ml: 7 }}
                                onChange={handleAdminToggle}
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
