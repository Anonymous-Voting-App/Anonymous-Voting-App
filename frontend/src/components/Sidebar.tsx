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
    return (
        <Slide direction="right" in={true}>
            <Box className="sidebar" role="presentation">
                <List className="list">
                    {pages.map((page) => (
                        <ListItem key={page} disablePadding>
                            <ListItemButton>
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
