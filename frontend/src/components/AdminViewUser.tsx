import React from 'react';
import { Typography, Link, Box } from '@mui/material';
import './AdminViewPoll.scss';
import { deleteUser } from '../services/pollAndUserService';
import { useNavigate } from 'react-router-dom';

const AdminViewPoll = (props: any) => {
    const navigate = useNavigate();

    const handleEdit = (user: any) => {
        navigate(`edit`, {
            state: {
                user: user.userName,
                id: user.id,
                isAdmin: user.isAdmin
            }
        });
    };

    const handleDelete = (userId: string) => {
        // deletePoll(pollId).
        deleteUser(userId).then((response) => {
            if (response.success) {
                props.showNotification({
                    severity: 'success',
                    message: 'User deleted successfully'
                });
            } else {
                props.showNotification({
                    severity: 'error',
                    message: 'Error occured while deleting user'
                });
            }
        });
    };

    return (
        <div className="wrapper-div">
            <Box key={props.userData} className="listItem">
                <Typography>{props.userData.userName}</Typography>
                <Link
                    className="pinkLink"
                    onClick={() => handleEdit(props.userData)}
                >
                    Edit
                </Link>
                <Link
                    className="deleteLink"
                    onClick={() => handleDelete(props.userData.id)}
                    href="#"
                >
                    Delete user
                </Link>
            </Box>
        </div>
    );
};

export default AdminViewPoll;
