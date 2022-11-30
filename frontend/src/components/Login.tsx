import Field from './Field';
import './LoginAndRegister.scss';
import { login } from '../services/loginAndRegisterService';
import { useState } from 'react';
import { Typography, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Login(props: any) {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const InputHandler = (value: string, index: number) => {
        index === 0 ? setUsername(value) : setPassword(value);
    };

    const handleLogin = () => {
        login(username, password).then((response) => {
            console.log(response);
        });

        navigate('/');
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
                    ind={0}
                ></Field>
                <Field
                    page="login"
                    text="Password"
                    input={password}
                    onInput={InputHandler}
                    ind={1}
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
        </div>
    );
}

export default Login;
