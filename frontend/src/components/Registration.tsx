import { useState } from 'react';
import { Typography, Paper, Button } from '@mui/material';
import './LoginAndRegister.scss';
import { register } from '../services/loginAndRegisterService';
import Field from './Field';
import { useNavigate } from 'react-router-dom';
import BasicSnackbar from './BasicSnackbar';

function Registration() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [open, setOpen] = useState(false);
    const [notificationObj, setNotificationObj] = useState({
        message: '',
        severity: ''
    });

    const InputHandler = (value: string, index: string) => {
        switch (index) {
            case '0':
                setUsername(value);
                break;
            case '1':
                setPassword(value);
                break;
            case '2':
                setPasswordAgain(value);
                break;
            case '3':
                setFirstName(value);
                break;
            case '4':
                setLastName(value);
                break;
            case '5':
                setEmail(value);
                break;
        }
    };

    const showNotification = (status: {
        severity: string;
        message: string;
    }) => {
        setOpen(true);
        setNotificationObj({
            ...notificationObj,
            message: status.message,
            severity: status.severity
        });
    };

    const closeNotification = () => {
        setOpen(false);
    };

    const handleRegister = () => {
        if (password !== passwordAgain) {
            showNotification({
                severity: 'error',
                message: "Passwords don't match"
            });
        } else {
            register(username, password, firstName, lastName, email)
                .then(() => {
                    showNotification({
                        severity: 'success',
                        message: 'Register successful'
                    });
                    setTimeout(() => {
                        navigate('/login');
                    }, 800);
                })
                .catch(() => {
                    showNotification({
                        severity: 'error',
                        message: 'Register unsuccessful'
                    });
                });
        }
    };

    return (
        <div className="main-wrapper">
            <Typography variant="h4" className="page-heading">
                Register
            </Typography>
            <Paper className="fields-wrapper" elevation={3}>
                <div className="fields">
                    <Field
                        page="register"
                        text="Username"
                        input={username}
                        onInput={InputHandler}
                        ind={String(0)}
                    ></Field>
                    <Field
                        page="register"
                        text="Password"
                        input={password}
                        onInput={InputHandler}
                        ind={String(1)}
                    ></Field>
                    <Field
                        page="register"
                        text="Password again"
                        input={passwordAgain}
                        onInput={InputHandler}
                        ind={String(2)}
                    ></Field>
                </div>
            </Paper>
            <Paper className="fields-wrapper" elevation={3}>
                <div className="fields">
                    <Field
                        className="field"
                        page="register"
                        text="First name"
                        input={firstName}
                        onInput={InputHandler}
                        ind={String(3)}
                    ></Field>
                    <Field
                        page="register"
                        text="Last name"
                        input={lastName}
                        onInput={InputHandler}
                        ind={String(4)}
                    ></Field>
                    <Field
                        page="register"
                        text="Email"
                        input={email}
                        onInput={InputHandler}
                        ind={String(5)}
                    ></Field>
                </div>
            </Paper>

            <Button
                className="login-btn"
                sx={{ mt: '4.5rem', width: 200 }}
                variant="outlined"
                onClick={handleRegister}
            >
                Register
            </Button>
            <BasicSnackbar
                open={open}
                onClose={closeNotification}
                severity={notificationObj.severity}
                message={notificationObj.message}
            />
        </div>
    );
}

export default Registration;
