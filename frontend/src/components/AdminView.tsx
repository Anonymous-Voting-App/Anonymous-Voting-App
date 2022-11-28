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
import { fetchSearchResult } from '../services/pollService';
import AdminViewPoll from './AdminViewPoll';
import AdminViewUser from './AdminViewUser';
import BasicSnackbar from './BasicSnackbar';

// const TEST_USERS = ['Martti', 'user123'];

const PollAnswering = () => {
    const [searchBy, setSearchBy] = useState('');
    const [searchText, setSearchText] = useState('');
    const [showPollList, setShowPollList] = useState(false);
    const [showUserList, setShowUserList] = useState(false);
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const [pollList, setPollList] = useState<any>([]);
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
        setOpen(true);
        setNotificationObj({
            ...notificationObj,
            message: status.message,
            severity: status.severity
        });
        handleSearchClick();
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
        if (searchBy === 'Poll name/ID') {
            const data = await fetchData(searchText, 'poll');
            console.log(pollList);
            if (data.length > 0) {
                setShowUserList(false);
                setShowPollList(true);
                setPollList(data);
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
        } else {
            setShowUserList(true);
            setShowPollList(false);
            fetchData(searchText, 'user');
        }
    };

    /**
     * calling the search api based on search text and searchBy type
     * @param text - search text
     * @param searchType - poll/user
     * @returns
     */
    const fetchData = (text: string, searchType: string) => {
        const searchResult = fetchSearchResult(text, searchType)
            .then((response) => {
                console.log(response.data);
                if (response.data.length > 0) {
                    setShowErrorMsg(false);
                    return response.data;
                }
                setShowErrorMsg(true);
                return [];
            })
            .catch((error) => {
                console.log('No data');
                setShowErrorMsg(true);
                setOpen(true);
                setNotificationObj({
                    ...notificationObj,
                    message: 'Sorry no data found',
                    severity: 'error'
                });
                return [];
            });
        return searchResult;
    const handleResult = (user: string) => {
        // navigate('/result', {replace: true});
        navigate(`result`);
    };

    const handleEdit = (user: string) => {
        navigate(`edit`, { state: { username: user } });
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
                        <MenuItem value="Poll name/ID">Poll name/ID</MenuItem>
                        <MenuItem value="User name/ID">User name/ID</MenuItem>
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

                    {showPollList
                        ? pollList.map((poll: any) => {
                              return (
                                  <div key={poll.id}>
                                      <AdminViewPoll
                                          pollData={poll}
                                          showNotification={handleNotification}
                                      ></AdminViewPoll>
                                  </div>
                              );
                          })
                        : null}
                    {showUserList ? <AdminViewUser></AdminViewUser> : null}
                </div>
            )}
            {/* {showSearchResults ? (
                <div className="listItems">
                    {TEST_USERS.map((user) => {
                        return (
                            <Box key={user} className="listItem">
                                <Typography>{user}</Typography>
                                <Link
                                    className="pinkLink"
                                    onClick={() => handleEdit(user)}
                                >
                                    Edit
                                </Link>
                                <Link
                                    className="pinkLink"
                                    onClick={() => handleResult(user)}
                                >
                                    View Results
                                </Link>
                                <Link className="pinkLink" href="#">
                                    View links
                                </Link>
                                <Link className="deleteLink" href="#">
                                    Delete
                                </Link>
                            </Box>
                        );
                    })}
                </div>
            ) : null} */}
            <BasicSnackbar
                open={open}
                onClose={handleClose}
                severity={notificationObj.severity}
                message={notificationObj.message}
            />
        </Container>
    );
};

export default PollAnswering;
