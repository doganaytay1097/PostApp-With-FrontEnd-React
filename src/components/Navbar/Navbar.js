import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
    link: {
        textDecoration: 'none',
        color: 'white',

    },
}));

function Navbar() {
    const classes = useStyles();
    let userId = 5;

    return (
        <Box sx={{ flexGrow: 1 }}>
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
                        <Link to={`/users/${userId}`} className={classes.link}>Users</Link>
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navbar;
