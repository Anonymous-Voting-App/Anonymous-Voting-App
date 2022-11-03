import Field from './Field';
import './LoginAndRegister.scss';
import { useState } from 'react';
import { Typography, Button, Link } from '@mui/material';

function Login(props: any) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const InputHandler = (value: string, index: number) => {
        index === 0 ? setUsername(value) : setPassword(value);
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
                >
                    Login
                </Button>
            </div>

            <div className="texts">
                <Typography className="bottom-text">
                    Don't have an account?
                </Typography>
                <Link className="bottom-text link">Register</Link>
            </div>
        </div>
    );
}

export default Login;
