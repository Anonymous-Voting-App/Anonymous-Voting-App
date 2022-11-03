import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import AVALogo from './ava.svg';
import Sidebar from './Sidebar';
import IconButton from '@mui/material/IconButton';
import './NavBar.scss';

const NavBar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <>
            <AppBar className="navigation">
                {sidebarOpen && <Sidebar />}
                <IconButton
                    className="hamburgerMenu"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {!sidebarOpen ? (
                        <MenuIcon className="menuIcon" />
                    ) : (
                        <CloseIcon className="closeIcon"></CloseIcon>
                    )}
                </IconButton>

                <img
                    className="logo"
                    src={AVALogo}
                    alt="Anonymous voting app logo"
                />

                <Typography className="login">Login</Typography>

                <PersonIcon className="profile"></PersonIcon>
            </AppBar>
        </>
    );
};

export default NavBar;
