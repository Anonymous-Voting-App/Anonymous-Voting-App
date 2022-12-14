import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import './BasicSnackbar.scss';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function BasicSnackbar(props: any) {
    return (
        <>
            <Snackbar
                open={props.open}
                autoHideDuration={4000}
                onClose={props.onClose}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
                <Alert onClose={props.onClose} severity={props.severity}>
                    {props.message}
                </Alert>
            </Snackbar>
        </>
    );
}

export default BasicSnackbar;
