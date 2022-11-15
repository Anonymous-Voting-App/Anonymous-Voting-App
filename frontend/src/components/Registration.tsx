import { useState } from 'react';
import { Typography, Paper, Button } from '@mui/material';
import './LoginAndRegister.scss';
import Field from './Field';

function Registration() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const InputHandler = (value: string, index: number) => {
        switch (index) {
            case 0:
                setUsername(value);
                break;
            case 1:
                setPassword(value);
                break;
            case 2:
                setPassword2(value);
                break;
            case 3:
                setFirstName(value);
                break;
            case 4:
                setLastName(value);
                break;
            case 5:
                setEmail(value);
                break;
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
                        ind={3}
                    ></Field>
                    <Field
                        page="register"
                        text="Last name"
                        input={lastName}
                        onInput={InputHandler}
                        ind={4}
                    ></Field>
                    <Field
                        page="register"
                        text="Email"
                        input={email}
                        onInput={InputHandler}
                        ind={5}
                    ></Field>
                </div>
            </Paper>

            <Button
                className="login-btn"
                sx={{ mt: '4.5rem', width: 200 }}
                variant="outlined"
            >
                Register
            </Button>
        </div>
    );
}

export default Registration;