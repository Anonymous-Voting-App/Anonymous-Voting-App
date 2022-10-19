import React, { useState } from 'react';
import './App.scss';
import './NavBar.scss';
import NavBar from './NavBar';
import PollCreationPage from './PollCreationPage';
import BasicSnackbar from './BasicSnackbar';
//import PollAnsweringPage from './PollAnsweringPage';

function App() {
    const [open, setOpen] = useState(false);
    const [notificationObj, setNotificationObj] = useState({
        message: '',
        severity: ''
    });

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
            <PollCreationPage
                showNotification={handleNotification}
            ></PollCreationPage>
            {/*<PollAnsweringPage></PollAnsweringPage>*/}
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
