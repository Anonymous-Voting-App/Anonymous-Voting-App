import { useState } from 'react';
import { Typography, Container, Button } from '@mui/material';
import './LoginAndRegister.scss';
import Field from './Field';

function UserInfoRegistration() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const InputHandler = (value: string, index: number) => {
        if (index === 0) {
            setFirstName(value);
        } else if (index === 1) {
            setLastName(value);
        } else {
            setEmail(value);
        }
    };

    return (
        <Container className="main-wrapper">
            <Typography variant="h4" className="page-heading">
                Register
            </Typography>
            <Container>
                <Field
                    className="field"
                    page="register"
                    text="First name"
                    input={firstName}
                    onInput={InputHandler}
                    ind={0}
                ></Field>
                <Field
                    page="register"
                    text="Last name"
                    input={lastName}
                    onInput={InputHandler}
                    ind={1}
                ></Field>
                <Field
                    page="register"
                    text="Email"
                    input={email}
                    onInput={InputHandler}
                    ind={2}
                ></Field>

                <Button
                    className="login-btn"
                    sx={{ mt: '4.5rem', width: 200 }}
                    variant="outlined"
                >
                    Register
                </Button>
            </Container>
        </Container>
    );
}

export default UserInfoRegistration;
