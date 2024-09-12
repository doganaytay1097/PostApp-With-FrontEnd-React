import React from "react";
import { Link } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { CardContent, InputAdornment, OutlinedInput, Avatar } from "@mui/material";

const theme = createTheme({
    spacing: 8,
});

const useStyles = makeStyles(() => ({
    comment: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    small: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
    link: {
        textDecoration: "none",
        boxShadow: "none",
        color: "white",
    }
}));

function Comment(props) {
    const { text, userId, userName } = props;
    const classes = useStyles();

    return (
        <ThemeProvider theme={theme}>
            <CardContent className={classes.comment}>
                <OutlinedInput
                    disabled
                    id="outlined-adornment-amount"
                    multiline
                    inputProps={{ maxLength: 250 }}
                    fullWidth
                    value={text}
                    startAdornment={
                        <InputAdornment position="start">
                            <Link className={classes.link} to={{ pathname: '/users/' + userId }}>
                                <Avatar aria-label="recipe" className={classes.small}>
                                    {userName ? userName.charAt(0).toUpperCase() : '?'}
                                </Avatar>
                            </Link>
                        </InputAdornment>
                    }
                    style={{ color: "black", backgroundColor: 'white' }}
                />
            </CardContent>
        </ThemeProvider>
    );
}

export default Comment;
