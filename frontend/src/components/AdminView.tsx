import React, { useState } from 'react';
import {
    Container,
    Typography,
    Button,
    FormControl,
    Select,
    MenuItem,
    SelectChangeEvent,
    TextField,
    Link,
    Box
} from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import './AdminView.scss';
import { useNavigate } from 'react-router-dom';

const TEST_USERS = ['Martti', 'user123'];

const PollAnswering = () => {
    let navigate = useNavigate();
    const [searchBy, setSearchBy] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);

    const handleTypeChange = (e: SelectChangeEvent<string>) => {
        setSearchBy(e.target.value);
    };

    const handleSearchClick = () => {
        setShowSearchResults(true);
    };

    const handleResult = (user: string) => {
        // navigate('/result', {replace: true});
        navigate(`result`);
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
                    className="searchField"
                    variant="outlined"
                    placeholder="Search text here"
                ></TextField>
                <Button
                    className="searchButton"
                    variant="outlined"
                    onClick={handleSearchClick}
                >
                    Search
                </Button>
            </div>
            {showSearchResults ? (
                <div className="listItems">
                    {TEST_USERS.map((user) => {
                        return (
                            <Box key={user} className="listItem">
                                <Typography>{user}</Typography>
                                <Link className="pinkLink" href="#">
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
            ) : null}
        </Container>
    );
};

export default PollAnswering;
