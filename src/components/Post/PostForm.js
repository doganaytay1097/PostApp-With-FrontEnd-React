import React, {useState} from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {Button, OutlinedInput, InputAdornment, Snackbar, Alert} from "@mui/material";
import {makeStyles} from '@mui/styles';
import {Link} from "react-router-dom";

const useStyles = makeStyles(() => ({
    avatar: {
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        color: 'white',
    },
    link: {
        boxShadow: 'none',
        textDecoration: 'none',
        color: 'white',
    },
    card: {
        width: '100%',
    },
    expandMore: {
        margin: '20px',
        marginLeft: 'auto',
        transition: 'transform 0.2s',
    },
}));

function PostForm(props) {
    const {userId, userName,refreshPost} = props;
    const classes = useStyles();
    const [text, setText] = useState("");
    const [title, setTitle] = useState("");
    const [isSent, setIsSent] = useState(false);


    const savePost = () => {
        fetch("/posts", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                title: title,
                userId: userId,
                text: text,
            })
        })
            .then(res => res.json())
            .catch(err => console.log(err));
    }

    const handleSubmit = () => {
        savePost();
        refreshPost();
        setIsSent(true);
        setTitle("");
        setText("");
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setIsSent(false);
    };

    const handleTitle = (value) => {
        setTitle(value);
        setIsSent(false);
    }

    const handleText = (value) => {
        setText(value);
        setIsSent(false);
    }


    return (
        <div style={{width: '800px', marginBottom: '20px'}}>
            <Snackbar open={isSent} autoHideDuration={1200} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Your post sent.
                </Alert>
            </Snackbar>
            <Card className={classes.card}>
                <CardHeader
                    avatar={
                        <Link to={`/users/${userId}`} className={classes.link}>
                            <Avatar className={classes.avatar} aria-label="recipe">
                                {userName ? userName.charAt(0).toUpperCase() : "!"}
                            </Avatar>
                        </Link>
                    }
                    title={
                        <Typography variant="h6" sx={{textAlign: 'left'}}>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                multiline
                                placeholder="Title"
                                inputProps={{maxLength: 25}}
                                fullWidth
                                value={title}
                                onChange={(i) => handleTitle(i.target.value)}
                            />
                        </Typography>
                    }
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary" sx={{textAlign: 'left'}}>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            multiline
                            placeholder="Text"
                            inputProps={{maxLength: 250}}
                            fullWidth
                            value={text}
                            onChange={(i) => handleText(i.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <Button variant="contained"
                                            style={{
                                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                                color: 'white'
                                            }}
                                            onClick={handleSubmit}
                                    >
                                        Post
                                    </Button>
                                </InputAdornment>
                            }
                        />
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
}

export default PostForm;
