import { useState } from 'react';
import {
    Typography,
    Container,
    Button,
    Link,
    FormControl,
    InputLabel,
    OutlinedInput
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import './LoginPage.scss';

function LoginPage(props: any) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [shrinkName, setShrinkName] = useState(false);
    const [notchedName, setNotchedName] = useState(false);
    const [moveName, setMoveName] = useState('label move-right');
    const [shrinkPassword, setShrinkPassword] = useState(false);
    const [notchedPassword, setNotchedPassword] = useState(false);
    const [movePassword, setMovePassword] = useState('label move-right');

    const onNameInput = (value: string) => {
        setUsername(value);
    };

    const onPasswordInput = (value: string) => {
        setPassword(value);
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

    return (
        <Container className="main-wrapper">
            <Typography variant="h4" className="page-heading">
                Login
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
                        username
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
                        password
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
