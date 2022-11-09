import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.scss';
import NavBar from './NavBar';
import PollCreation from './PollCreation';
import Registration from './Registration';
import Login from './Login';
import BasicSnackbar from './BasicSnackbar';
import PollAnswering from './PollAnswering';
import AdminView from './AdminView';
import { StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

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
        <>
            <CssBaseline />
            <StyledEngineProvider injectFirst>
                <BrowserRouter>
                    <div className="App">
                        <NavBar></NavBar>

                        <Routes>
                            <Route
                                index
                                element={
                                    <PollCreation
                                        showNotification={handleNotification}
                                    ></PollCreation>
                                }
                            />
                            <Route path="/answer" element={<PollAnswering />} />
                            <Route path="/admin" element={<AdminView />} />
                            <Route path="/login" element={<Login />} />
                            <Route
                                path="/register"
                                element={<Registration />}
                            />
                        </Routes>

                        <BasicSnackbar
                            open={open}
                            onClose={handleClose}
                            severity={notificationObj.severity}
                            message={notificationObj.message}
                        />
                    </div>
                </BrowserRouter>
            </StyledEngineProvider>
        </>
    );
}

export default App;
