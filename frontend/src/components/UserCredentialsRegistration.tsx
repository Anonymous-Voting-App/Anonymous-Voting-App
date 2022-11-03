import { useState } from 'react';
import { Typography, Container, Button } from '@mui/material';
import './LoginAndRegister.scss';
import Field from './Field';

function UserCredentialsRegistration() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    const InputHandler = (value: string, index: number) => {
        if (index === 0) {
            setUsername(value);
        } else if (index === 1) {
            setPassword(value);
        } else {
            setPassword2(value);
        }
    };

    return (
        <Container className="main-wrapper">
            <Typography variant="h4" className="page-heading">
                Register
            </Typography>
            <Container>
                <Field
                    page="register"
                    text="Username"
                    input={username}
                    onInput={InputHandler}
                    ind={0}
                ></Field>
                <Field
                    page="register"
                    text="Password"
                    input={password}
                    onInput={InputHandler}
                    ind={1}
                ></Field>
                <Field
                    page="register"
                    text="Password again"
                    input={password2}
                    onInput={InputHandler}
                    ind={2}
                ></Field>

                <Button
                    className="login-btn"
                    sx={{ mt: '4.5rem', width: 200 }}
                    variant="outlined"
                >
                    Next
                </Button>
            </Container>
        </Container>
    );
}

export default UserCredentialsRegistration;
