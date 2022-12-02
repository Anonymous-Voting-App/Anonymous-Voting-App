import { useState, useEffect } from 'react';
import { Typography, Button, TextField } from '@mui/material';
import { fetchAllPolls } from '../services/pollAndUserService';
import AdminViewPoll from './AdminViewPoll';
import BasicSnackbar from './BasicSnackbar';
import './MyPolls.scss';

const MyPolls = (props: any) => {
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const [open, setOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [resultCount, setResultCount] = useState(0);
    const [pollList, setPollList] = useState<any>([]);
    const [notificationObj, setNotificationObj] = useState({
        message: '',
        severity: ''
    });

    useEffect(() => {
        fetchAllPolls()
            .then((response) => {
                console.log(response.data);
                const data = response.data;
                if (data.length > 0) {
                    setPollList(data);
                    setResultCount(data.length);
                }
            })
            .catch((error) => {
                console.log('error');
            });
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    const handleSearch = () => {
        fetchAllPolls()
            .then((response) => {
                const data = response.data;
                if (data.length > 0) {
                    var newList: Array<any> = [];
                    data.map((poll: any) => {
                        if (poll.name.includes(searchText)) {
                            newList = [...newList, poll];
                            return 0;
                        }
                    });
                    setResultCount(newList.length);
                    setPollList(newList);
                }
            })
            .catch((error) => {
                console.log('error');
            });
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
                    onClick={handleSearch}
                >
                    Search
                </Button>
            </div>
            {showErrorMsg ? (
                <div className="errorMessage search-content">No data found</div>
            ) : (
                <div className="search-content">
                    {
                        <div className="count-data">
                            Results found: {resultCount}
                        </div>
                    }

                    {pollList.map((poll: any) => {
                        return (
                            <div key={poll.id}>
                                <AdminViewPoll pollData={poll}></AdminViewPoll>
                            </div>
                        );
                    })}
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
