import { useState, useEffect } from 'react';
import { Typography, Button, TextField } from '@mui/material';
import { fetchSearchResult } from '../services/pollService';
import AdminViewPoll from './AdminViewPoll';
import AdminViewUser from './AdminViewUser';
import BasicSnackbar from './BasicSnackbar';
import './MyPolls.scss';

const MyPolls = (props: any) => {
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const [showPollList, setShowPollList] = useState(true);
    const [showUserList, setShowUserList] = useState(false);
    const [open, setOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [resultCount, setResultCount] = useState(0);
    const [pollList, setPollList] = useState<any>([]);
    const [notificationObj, setNotificationObj] = useState({
        message: '',
        severity: ''
    });

    useEffect(() => {
        const handleSearchClick = async (searchText: string) => {
            // setShowSearchResults(true);
            const data = await fetchData(searchText, 'poll');
            setPollList(data);
            //console.log(pollList);
            if (data.length > 0) {
                setShowUserList(false);
                setShowPollList(true);
                setPollList(data);
                setResultCount(data.length);
            }
        };
        handleSearchClick(props.username); //don't know what to put here
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearchClick = async () => {
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
    };

    const handleClose = () => {
        setOpen(false);
    };

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
                console.log('No data', error);
                setShowErrorMsg(true);
                return [];
            });
        return searchResult;
    };

    return (
        <div>
            <Typography variant="h4" className="page-title">
                My polls
            </Typography>
            <div className="polls-container">
                <TextField
                    autoComplete="off"
                    className="search-field"
                    variant="outlined"
                    placeholder="Search by poll name"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                ></TextField>

                <Button
                    disabled={searchText === ''}
                    type="submit"
                    className="search-button"
                    variant="outlined"
                    onClick={handleSearchClick}
                >
                    Search
                </Button>
            </div>
            {showErrorMsg ? (
                <div className="errorMessage search-content">No data found</div>
            ) : (
                <div className="search-content">
                    {resultCount > 0 ? (
                        <div className="count-data">
                            Results found: {resultCount}
                        </div>
                    ) : null}

                    {showPollList
                        ? pollList.map((poll: any) => {
                              return (
                                  <div key={poll.id}>
                                      <AdminViewPoll
                                          pollData={poll}
                                      ></AdminViewPoll>
                                  </div>
                              );
                          })
                        : null}
                    {showUserList ? <AdminViewUser></AdminViewUser> : null}
                </div>
            )}
            <BasicSnackbar
                open={open}
                onClose={handleClose}
                severity={notificationObj.severity}
                message={notificationObj.message}
            />
        </div>
    );
};

export default MyPolls;
