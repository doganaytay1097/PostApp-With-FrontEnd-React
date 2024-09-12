import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { makeStyles } from '@mui/styles';
import { LockOpen } from "@mui/icons-material";

const useStyles = makeStyles(() => ({
    link: {
        textDecoration: 'none',
        color: 'white',
    },
}));

function Navbar() {
    const classes = useStyles();
    const navigate = useNavigate(); // useHistory yerine useNavigate kullanılıyor

    const onClick = () => {
        localStorage.removeItem('tokenKey');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('refreshKey');
        localStorage.removeItem('userName');
        navigate(0); // navigate kullanarak sayfayı yeniden yükle
    }

    return (
        <Box sx={{ flexGrow: 1 ,marginTop: '50px' }}>
            <AppBar position="fixed">
                <Toolbar sx={{ paddingTop: 0, paddingBottom: 0 }}>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div">
                        <Link to="/" className={classes.link}>Home</Link>
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography variant="h6" component="div">
                        {localStorage.getItem("currentUser") == null
                            ? <Link to={`/auth`} className={classes.link}>Login/Register</Link>
                            : <div style={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton onClick={onClick} color="inherit">
                                    <LockOpen />
                                </IconButton>
                                <Link to={`/users/` + localStorage.getItem("currentUser")} className={classes.link}>Profile</Link>
                            </div>}
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navbar;
