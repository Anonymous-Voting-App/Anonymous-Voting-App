import { useState } from 'react';
import { FormControl, InputLabel, OutlinedInput } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import './Field.scss';

function Field(props: any) {
    //MUI TextField automatically shrinks the label if there's a start adornment
    //so it's controlled through state
    const [shrink, setShrink] = useState(false);
    const [notched, setNotched] = useState(false);
    //With just shrink={false}, the label and adornment overlap.
    //Label needs to be moved to the right when it's not shrunken.
    //More when on login page, bit less on register.
    const [move, setMove] = useState(
        props.page === 'login' ? 'label move-login' : 'label move-register'
    );

    const inputHandler = (value: string) => {
        props.onInput(value, props.ind);
    };

    const handleFocus = () => {
        setShrink(true);
        setNotched(true);
        setMove('label');
    };

    const handleBlur = (value: string) => {
        if (!value) {
            setShrink(false);
            setNotched(false);
            setMove(
                props.page === 'login'
                    ? 'label move-login'
                    : 'label move-register'
            );
        }
    };

    return (
        <>
            <FormControl
                sx={{ minWidth: '260px' }}
                size="small"
                className="user-field"
            >
                <InputLabel
                    id="username-label"
                    htmlFor="username"
                    shrink={shrink}
                    className={move}
                >
                    {props.text}
                </InputLabel>

                <OutlinedInput
                    type={props.text.includes('Password') ? 'password' : 'text'}
                    onChange={(event) => inputHandler(event.target.value)}
                    onFocus={handleFocus}
                    onBlur={(event) => handleBlur(event.target.value)}
                    value={props.input}
                    className="input-field"
                    label={props.text}
                    id={props.ind}
                    autoComplete="no"
                    notched={notched}
                    //Adornment also needs to be moved right based on page view.
                    startAdornment={
                        props.text.includes('ame') ? (
                            <AccountCircle
                                fontSize="small"
                                className={
                                    props.page === 'login'
                                        ? 'input-field-icon-login'
                                        : 'input-field-icon-register'
                                }
                            />
                        ) : props.text.includes('Password') ? (
                            <LockIcon
                                fontSize="small"
                                className={
                                    props.page === 'login'
                                        ? 'input-field-icon-login'
                                        : 'input-field-icon-register'
                                }
                            />
                        ) : (
                            <EmailIcon
                                fontSize="small"
                                className="input-field-icon-register"
                            />
                        )
                    }
                />
            </FormControl>
        </>
    );
}

export default Field;
