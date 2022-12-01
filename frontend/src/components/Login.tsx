import Field from './Field';
import './LoginAndRegister.scss';
import { login } from '../services/loginAndRegisterService';
import { useState } from 'react';
import { Typography, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BasicSnackbar from './BasicSnackbar';

function Login(props: any) {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [open, setOpen] = useState(false);
    const [notificationObj, setNotificationObj] = useState({
        message: '',
        severity: ''
    });

    const InputHandler = (value: string, index: string) => {
        index === '0' ? setUsername(value) : setPassword(value);
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

    const handleLogin = () => {
        login(username, password)
            .then((response) => {
                console.log(response);
                navigate('/');
            })
            .catch((error) => {
                console.log(error);
                showNotification({
                    severity: 'error',
                    message: 'Invalid username or password'
                });
            });
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <div className="main-wrapper">
            <Typography variant="h4" className="page-heading">
                Login
            </Typography>
            <div className="fields">
                <Field
                    page="login"
                    text="Username"
                    input={username}
                    onInput={InputHandler}
                    ind={String(0)}
                ></Field>
                <Field
                    page="login"
                    text="Password"
                    input={password}
                    onInput={InputHandler}
                    ind={String(1)}
                ></Field>

                <Button
                    className="login-btn"
                    sx={{ mt: '4.5rem', width: 200 }}
                    variant="outlined"
                    onClick={handleLogin}
                >
                    Login
                </Button>
            </div>

            <div className="texts">
                <Typography className="bottom-text">
                    Don't have an account?
                </Typography>
                <Link
                    className="bottom-text link"
                    onClick={handleRegisterClick}
                >
                    Register
                </Link>
            </div>
            <BasicSnackbar
                open={open}
                onClose={closeNotification}
                severity={notificationObj.severity}
                message={notificationObj.message}
            />
        </div>
    );
}

export default Login;
