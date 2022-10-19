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
    InputLabel
} from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import './AdminView.scss';

const PollAnsweringPage = () => {
    const [searchBy, setSearchBy] = useState('');

    const handleTypeChange = (e: SelectChangeEvent<string>) => {
        setSearchBy(e.target.value);
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
                <Button className="searchButton" variant="outlined">
                    Search
                </Button>
            </div>
        </Container>
    );
};

export default PollAnsweringPage;
