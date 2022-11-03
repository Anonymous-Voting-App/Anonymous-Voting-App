import { useNavigate } from 'react-router-dom';
import KnowitLogo from './knowit.svg';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Slide,
    Typography
} from '@mui/material';
import './Sidebar.scss';

const pages = ['Create poll', 'My polls'];

const Sidebar = () => {
    const navigate = useNavigate();

    const handlePageClick = (page: string) => {
        if (page === 'Create poll') {
            navigate('/');
        } else if (page === 'My polls') {
            navigate('/admin');
        }
    };

    return (
        <Slide direction="right" in={true}>
            <Box className="sidebar" role="presentation">
                <List className="list">
                    {pages.map((page) => (
                        <ListItem key={page} disablePadding>
                            <ListItemButton
                                onClick={() => handlePageClick(page)}
                            >
                                <ListItemText
                                    className="page"
                                    primary={
                                        <Typography className="text">
                                            {page}
                                        </Typography>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <img className="knowit" src={KnowitLogo} alt="Knowit Logo" />
            </Box>
        </Slide>
    );
};

export default Sidebar;
