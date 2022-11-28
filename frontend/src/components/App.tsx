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
import PollResult from './PollResult';
import { StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AdminViewUser from './AdminViewUser';

function App() {
    const [open, setOpen] = useState(false);
    const [notificationObj, setNotificationObj] = useState({
        message: '',
        severity: ''
    });
    const [pollId, setPollId] = useState(
        '4c5365d6-a32f-4c86-b088-85cb0c4f64ea'
    );

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

    const handlePollId = (id: string) => {
        setPollId(id);
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
                                        setPollId={handlePollId}
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
                            <Route
                                path="admin/result"
                                element={
                                    <PollResult
                                        pollId={pollId}
                                        showNotification={handleNotification}
                                    />
                                }
                            />
                            <Route
                                path="admin/edit"
                                element={<AdminViewUser />}
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
