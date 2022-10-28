import React, { useState } from 'react';
import './App.scss';
import NavBar from './NavBar';
import PollCreation from './PollCreation';
import UserCredentialsRegistration from './UserCredentialsRegistration';
import UserInfoRegistration from './UserInfoRegistration';
import Login from './Login';
import BasicSnackbar from './BasicSnackbar';
import PollAnswering from './PollAnswering';
import AdminView from './AdminView';

function App() {
    const [open, setOpen] = useState(false);
    const [notificationObj, setNotificationObj] = useState({
        message: '',
        severity: ''
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleNotification = (status: {
        severity: string;
        message: string;
    }) => {
        setOpen(true);
        setNotificationObj({
            ...notificationObj,
            message: status.message,
            severity: status.severity
        });
        console.log(status, 'notification data');
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <div className="App">
            <NavBar></NavBar>
            {/*For now since we don't have routing, comment out the components
            you don't want to see.*/}
            <PollCreation showNotification={handleNotification}></PollCreation>
            {/*<PollAnswering></PollAnswering>*/}
            <AdminView></AdminView>
            <BasicSnackbar
                open={open}
                onClose={handleClose}
                severity={notificationObj.severity}
                message={notificationObj.message}
            />
        </div>
    );
}

export default App;
