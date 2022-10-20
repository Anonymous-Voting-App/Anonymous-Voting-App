import { useState } from 'react';
import { FormControl, InputLabel, OutlinedInput } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import './Field.scss';

function Field(props: any) {
    const [info, setInfo] = useState('');
    //MUI TextField automatically shrinks the label if there's a start adornment
    //so it's controlled through state
    const [shrink, setShrink] = useState(false);
    const [notched, setNotched] = useState(false);
    //With just shrink={false}, the label and adornment overlap.
    //Label needs to be moved to the right when it's not shrunken,
    //more when on login page.
    const [move, setMove] = useState(
        props.page === 'login' ? 'label move-login' : 'label move-register'
    );

    const inputHandler = (value: string) => {
        setInfo(value);
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
                    type={props.text === 'Username' ? 'text' : 'password'}
                    onChange={(event) => inputHandler(event.target.value)}
                    onFocus={handleFocus}
                    onBlur={(event) => handleBlur(event.target.value)}
                    value={info}
                    className="input-field"
                    label={props.text}
                    id={props.text}
                    autoComplete="off"
                    notched={notched}
                    //Adornment also needs to be moved right based on page view.
                    startAdornment={
                        props.text === 'Username' ? (
                            <AccountCircle
                                className={
                                    props.page === 'login'
                                        ? 'input-field-icon-login'
                                        : 'input-field-icon-register'
                                }
                            />
                        ) : (
                            <LockIcon
                                className={
                                    props.page === 'login'
                                        ? 'input-field-icon-login'
                                        : 'input-field-icon-register'
                                }
                            />
                        )
                    }
                />
            </FormControl>
        </>
    );
}

export default Field;
