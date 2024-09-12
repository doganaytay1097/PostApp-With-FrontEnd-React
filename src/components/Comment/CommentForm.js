import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { CardContent, InputAdornment, OutlinedInput, Avatar, Button } from "@mui/material";
import {PostWithAuth, RefreshToken} from "../../services/HttpService";

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

function CommentForm(props) {
    const { userId, postId, setCommentRefresh,userName } = props;
    const classes = useStyles();
    const [text, setText] = useState("");
    const navigate = useNavigate();


    const handleChange = (event) => {
        setText(event.target.value);
    };

    const handleSubmit = () => {
        saveComment();
        setText("");
        setCommentRefresh();
    };

    const logout = () => {
        localStorage.removeItem('tokenKey');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('refreshKey');
        localStorage.removeItem('userName');
        navigate(0); // navigate kullanarak sayfayı yeniden yükle
    }

    const saveComment = () => {
        PostWithAuth("/comments",{
            postId: postId,
            userId: userId,
            text: text,
        })
            .then((res) => {
                if(!res.ok) {
                    RefreshToken()
                        .then((res) => { if(!res.ok) {
                            logout();
                        } else {
                            return res.json()
                        }})
                        .then((result) => {
                            console.log(result)

                            if(result != undefined){
                                localStorage.setItem("tokenKey",result.accessToken);
                                saveComment();
                                setCommentRefresh();
                            }})
                        .catch((err) => {
                            console.log(err)
                        })
                } else
                    res.json()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <ThemeProvider theme={theme}>
            <CardContent className={classes.comment}>
                <OutlinedInput
                    id="outlined-adornment-amount"
                    multiline
                    inputProps={{ maxLength: 250 }}
                    fullWidth
                    onChange={handleChange}
                    startAdornment={
                        <InputAdornment position="start">
                            <Link className={classes.link} to={{ pathname: '/users/' + userId }}>
                                <Avatar aria-label="recipe" className={classes.small}>
                                    {userName ? userName.charAt(0).toUpperCase() : '?'}
                                </Avatar>
                            </Link>
                        </InputAdornment>
                    }
                    endAdornment={
                        <InputAdornment position="end">
                            <Button
                                variant="contained"
                                style={{
                                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                    color: 'white'
                                }}
                                onClick={handleSubmit}
                            >
                                Yorum Yap
                            </Button>
                        </InputAdornment>
                    }
                    value={text}
                    style={{ color: "black", backgroundColor: 'white' }}
                />
            </CardContent>
        </ThemeProvider>
    );
}

export default CommentForm;

