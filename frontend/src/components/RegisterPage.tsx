import { useState } from 'react';
import {
    Typography,
    Container,
    Button,
    FormControl,
    InputLabel,
    OutlinedInput
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import './RegisterPage.scss';

function LoginPage(props: any) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [shrinkName, setShrinkName] = useState(false);
    const [notchedName, setNotchedName] = useState(false);
    const [moveName, setMoveName] = useState('label move-right');
    const [shrinkPassword, setShrinkPassword] = useState(false);
    const [notchedPassword, setNotchedPassword] = useState(false);
    const [movePassword, setMovePassword] = useState('label move-right');
    const [shrinkPassword2, setShrinkPassword2] = useState(false);
    const [notchedPassword2, setNotchedPassword2] = useState(false);
    const [movePassword2, setMovePassword2] = useState('label move-right');

    const onNameInput = (value: string) => {
        setUsername(value);
    };

    const onPasswordInput = (value: string) => {
        setPassword(value);
    };

    const onPassword2Input = (value: string) => {
        setPassword2(value);
    };

    const handleFocusName = () => {
        setShrinkName(true);
        setNotchedName(true);
        setMoveName('label');
    };

    const handleBlurName = (value: string) => {
        if (!value) {
            setShrinkName(false);
            setNotchedName(false);
            setMoveName('label move-right');
        }
    };

    const handleFocusPassword = () => {
        setShrinkPassword(true);
        setNotchedPassword(true);
        setMovePassword('label');
    };

    const handleBlurPassword = (value: string) => {
        if (!value) {
            setShrinkPassword(false);
            setNotchedPassword(false);
            setMovePassword('label move-right');
        }
    };

    const handleFocusPassword2 = () => {
        setShrinkPassword2(true);
        setNotchedPassword2(true);
        setMovePassword2('label');
    };

    const handleBlurPassword2 = (value: string) => {
        if (!value) {
            setShrinkPassword2(false);
            setNotchedPassword2(false);
            setMovePassword2('label move-right');
        }
    };

    return (
        <Container className="main-wrapper">
            <Typography variant="h4" className="page-heading">
                Register
            </Typography>
            <Container className="fields">
                <FormControl
                    sx={{ minWidth: '260px' }}
                    size="small"
                    className="user-field"
                >
                    <InputLabel
                        id="username-label"
                        htmlFor="username"
                        shrink={shrinkName}
                        className={moveName}
                    >
                        Username
                    </InputLabel>

                    <OutlinedInput
                        type="text"
                        onChange={(event) => onNameInput(event.target.value)}
                        onFocus={handleFocusName}
                        onBlur={(event) => handleBlurName(event.target.value)}
                        value={username}
                        className="input-field username"
                        label="username"
                        id="username"
                        autoComplete="off"
                        notched={notchedName}
                        startAdornment={
                            <AccountCircle className="input-field-icon" />
                        }
                    />
                </FormControl>

                <FormControl
                    sx={{ minWidth: '260px' }}
                    size="small"
                    className="user-field"
                >
                    <InputLabel
                        id="password-label"
                        htmlFor="password"
                        className={movePassword}
                        shrink={shrinkPassword}
                    >
                        Password
                    </InputLabel>
                    <OutlinedInput
                        type="text"
                        onFocus={handleFocusPassword}
                        onBlur={(event) =>
                            handleBlurPassword(event.target.value)
                        }
                        onChange={(event) =>
                            onPasswordInput(event.target.value)
                        }
                        value={'*'.repeat(password.length)}
                        className="input-field"
                        label="password"
                        id="password"
                        notched={notchedPassword}
                        autoComplete="off"
                        startAdornment={
                            <LockIcon className="input-field-icon" />
                        }
                    />
                </FormControl>

                <FormControl
                    sx={{ minWidth: '260px' }}
                    size="small"
                    className="user-field"
                >
                    <InputLabel
                        id="password-label"
                        htmlFor="Password again"
                        className={movePassword2}
                        shrink={shrinkPassword2}
                    >
                        Password again
                    </InputLabel>
                    <OutlinedInput
                        type="text"
                        onFocus={handleFocusPassword2}
                        onBlur={(event) =>
                            handleBlurPassword2(event.target.value)
                        }
                        onChange={(event) =>
                            onPassword2Input(event.target.value)
                        }
                        value={'*'.repeat(password2.length)}
                        className="input-field"
                        label="Password again"
                        id="Password again"
                        notched={notchedPassword2}
                        autoComplete="off"
                        startAdornment={
                            <LockIcon className="input-field-icon" />
                        }
                    />
                </FormControl>

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

export default LoginPage;
