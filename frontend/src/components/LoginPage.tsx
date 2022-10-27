import { useState } from 'react';
import { Typography, Container, Button, Link } from '@mui/material';
import Field from './Field';
import './LoginAndRegisterPage.scss';

function LoginPage(props: any) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const InputHandler = (value: string, index: number) => {
        index === 0 ? setUsername(value) : setPassword(value);
    };

    return (
        <Container className="main-wrapper">
            <Typography variant="h4" className="page-heading">
                Login
            </Typography>
            <Container className="fields">
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
            </Container>

            <Container className="texts">
                <Typography className="bottom-text">
                    Don't have an account?
                </Typography>
                <Link className="bottom-text link">Register</Link>
            </Container>
        </Container>
    );
}

export default LoginPage;
