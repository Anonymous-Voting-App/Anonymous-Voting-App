import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import PersonIcon from '@mui/icons-material/Person';
import KnowItLogo from './knowit.svg';
import AVALogo from './ava.svg';
import './NavBar.scss';

const NavBar = () => {
    return (
        <AppBar className="navigation">
            <img className="know-it" src={KnowItLogo} alt="Knowit Logo" />

            <img
                className="logo"
                src={AVALogo}
                alt="Anonymous voting app logo"
            />

            <Typography className="login">Login</Typography>

            <PersonIcon className="profile"></PersonIcon>
        </AppBar>
    );
};

export default NavBar;
