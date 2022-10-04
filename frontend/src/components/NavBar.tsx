import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import PersonIcon from '@mui/icons-material/Person';
import KnowItLogo from './knowit.svg';
import AVALogo from './ava.svg';

const NavBar = () => {
    return (
        <AppBar
            className="navigation"
            elevation={0}
            style={{ backgroundColor: '#333333', position: 'relative' }}
        >
            <img className="know-it" src={KnowItLogo} alt="Knowit Logo" />

            <img
                className="logo"
                src={AVALogo}
                alt="Anonymous voting app logo"
            />

            <Typography className="login">Login</Typography>

            <PersonIcon
                className="profile"
                style={{ fontSize: 40, color: '#333333' }}
            ></PersonIcon>
        </AppBar>
    );
};

export default NavBar;
