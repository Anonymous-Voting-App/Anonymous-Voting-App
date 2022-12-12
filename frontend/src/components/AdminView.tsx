import React, { useState } from 'react';
import {
    Container,
    Typography,
    Button,
    FormControl,
    Select,
    MenuItem,
    SelectChangeEvent,
    TextField
} from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import './AdminView.scss';
import { fetchSearchPoll } from '../services/pollService';
import { fetchSearchUser } from '../services/userService';
// import AdminViewPoll from './AdminViewPoll';
// import AdminViewUser from './AdminViewUser';
import BasicSnackbar from './BasicSnackbar';
import AdminViewPollDataGrid from './AdminViewPollDataGrid';
import AdminViewUserDataGrid from './AdminViewUserDataGrid';

// const TEST_USERS = ['Martti', 'user123'];

const AdminView = () => {
    const [searchBy, setSearchBy] = useState('');
    const [searchText, setSearchText] = useState('');
    const [showPollList, setShowPollList] = useState(false);
    const [showUserList, setShowUserList] = useState(false);
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const [pollList, setPollList] = useState<any>([]);
    const [userList, setUserList] = useState<any>([]);
    const [open, setOpen] = useState(false);
    const [resultCount, setResultCount] = useState(0);
    // const [showSearchResults, setShowSearchResults] = useState(false);
    const [notificationObj, setNotificationObj] = useState({
        message: '',
        severity: ''
    });

    /**
     * Function to show toast notification on delete poll
     * @param status
     */
    const handleNotification = (status: {
        severity: string;
        message: string;
    }) => {
        showSnackBar(status);
        handleSearchClick();
    };

    const showSnackBar = (status: { severity: string; message: string }) => {
        setOpen(true);
        setNotificationObj({
            ...notificationObj,
            message: status.message,
            severity: status.severity
        });
    };

    const handleClose = () => {
        setOpen(false);
    };

    /**
     * Function to handle change in drop down value
     * sets the value of searchBy condition
     * @param e
     */
    const handleTypeChange = (e: SelectChangeEvent<string>) => {
        setSearchBy(e.target.value);
    };

    /**
     * Function to handle the fetched data, sets pollList
     * Based on searchBy type showPollList or showUserList flag is set
     */
    const handleSearchClick = async () => {
        // setShowSearchResults(true);
        if (searchBy === 'Poll name') {
            const data = await fetchData(searchText, 'poll');

            if (data.length > 0) {
                setShowUserList(false);
                setShowPollList(true);
                setPollList(data);
                setResultCount(data.length);
            } else {
                setShowErrorMsg(true);
                const status = {
                    message: 'Sorry no data found',
                    severity: 'error'
                };
                showSnackBar(status);
            }
        } else {
            const data = await fetchData(searchText, 'user');

            if (data.length > 0) {
                setShowUserList(true);
                setShowPollList(false);
                setUserList(data);
                setResultCount(data.length);
            } else {
                setShowErrorMsg(true);
                setOpen(true);
                setNotificationObj({
                    ...notificationObj,
                    message: 'Sorry no data found',
                    severity: 'error'
                });
            }
        }
    };

    /**
     * calling the search api based on search text and searchBy type
     * @param text - search text
     * @param searchType - poll/user
     * @returns
     */
    const fetchData = (text: string, searchType: string) => {
        const searchResult = (
            searchType === 'poll'
                ? fetchSearchPoll(text)
                : fetchSearchUser(text)
        )
            .then((response: { data: string | any[] }) => {
                if (response.data.length > 0) {
                    setShowErrorMsg(false);
                    return response.data;
                }
                setShowErrorMsg(true);
                return [];
            })
            .catch((error) => {
                setShowErrorMsg(true);
                const status = {
                    message: 'Sorry no data found',
                    severity: 'error'
                };
                showSnackBar(status);
                return [];
            });
        return searchResult;
    };

    return (
        <Container>
            <Typography className="title" variant="h4">
                Search
            </Typography>
            <div className="itemsContainer">
                <FormControl fullWidth className="searchFormControl">
                    <Select
                        className="searchBy"
                        displayEmpty={true}
                        IconComponent={KeyboardArrowDown}
                        renderValue={(value) =>
                            value?.length
                                ? Array.isArray(value)
                                    ? value.join(', ')
                                    : value
                                : 'Search by'
                        }
                        value={searchBy}
                        onChange={handleTypeChange}
                    >
                        <MenuItem value="Poll name">Poll name</MenuItem>
                        <MenuItem value="User name">User name</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    autoComplete="off"
                    className="searchField"
                    variant="outlined"
                    placeholder="Search text here"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                ></TextField>
                <Button
                    disabled={searchBy === '' || searchText === ''}
                    type="submit"
                    className="searchButton"
                    variant="outlined"
                    onClick={handleSearchClick}
                >
                    Search
                </Button>
            </div>

            {showErrorMsg ? (
                <div className="errorMessage searchContent">No data found</div>
            ) : (
                <div className="searchContent">
                    {resultCount > 0 ? (
                        <div className="countData">
                            Results found: {resultCount}
                        </div>
                    ) : null}

                    {showPollList ? (
                        <AdminViewPollDataGrid
                            data={pollList}
                            showNotification={handleNotification}
                        ></AdminViewPollDataGrid>
                    ) : null}
                    {showUserList ? (
                        // userList.map((user: any) => {
                        //       return (
                        //           <div key={user.id}>
                        //               <AdminViewUser
                        //                   userData={user}
                        //                   showNotification={handleNotification}
                        //               ></AdminViewUser>
                        //           </div>
                        //       );
                        //   })
                        <AdminViewUserDataGrid
                            data={userList}
                            showNotification={handleNotification}
                        ></AdminViewUserDataGrid>
                    ) : null}
                </div>
            )}
            <BasicSnackbar
                open={open}
                onClose={handleClose}
                severity={notificationObj.severity}
                message={notificationObj.message}
            />
        </Container>
    );
};

export default AdminView;
