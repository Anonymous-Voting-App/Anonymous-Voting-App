import { useNavigate } from 'react-router-dom';
import KnowitLogo from './knowit.svg';
import { userIsLoggedIn } from '../utils/userUtilities';
import { userIsAdmin } from '../utils/userUtilities';
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

const Sidebar = () => {
    const navigate = useNavigate();

    const pages = userIsLoggedIn()
        ? userIsAdmin()
            ? ['Create poll', 'Search']
            : ['Create poll', 'My polls']
        : ['Create poll'];

    const handlePageClick = (page: string) => {
        if (page === 'Create poll') {
            navigate('/');
        } else if (page === 'My polls') {
            navigate('/user');
        } else if (page === 'Search') {
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
