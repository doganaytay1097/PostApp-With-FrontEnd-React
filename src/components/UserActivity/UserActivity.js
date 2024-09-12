import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {useEffect, useState} from "react";
import {makeStyles} from "@mui/styles";
import {Button, Dialog, Slide, TableCell} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from '@mui/icons-material/Close';
import Post from "../Post/Post";
import {GetWithAuth, RefreshToken} from "../../services/HttpService";
import {useNavigate} from "react-router-dom";

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        // maxHeight: 440,
        // minWidth: 100,
        // maxWidth: 800,
        marginTop: 50,
    },
    appBar: {
        position: 'relative',

    },
    title: {

        marginLeft: 2,
        flex: 1,
    },
    div: {
        marginTop: '100px'
    },

});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function PopUp(props) {
    const classes = useStyles();
    const {isOpen, postId, setIsOpen} = props;
    const [open, setOpen] = useState(isOpen);
    const [post, setPost] = useState();
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('tokenKey');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('refreshKey');
        localStorage.removeItem('userName');
        navigate(0); // navigate kullanarak sayfayı yeniden yükle
    }

    const getPost = () => {
        GetWithAuth("/posts/" + postId)
            .then((res) => {
                if (!res.ok) {
                    // Token süresi dolmuşsa yenile
                    RefreshToken()
                        .then((res) => {
                            if (!res.ok) {
                                logout();  // Token yenileme başarısızsa çıkış yap
                            } else {
                                return res.json();
                            }
                        })
                        .then((result) => {
                            if (result) {
                                localStorage.setItem("tokenKey", result.accessToken);
                                getPost(); // Yenilenen token ile yeniden dene
                            }
                        })
                        .catch((err) => {
                            console.log("Token yenileme hatası:", err);
                        });
                } else {
                    return res.json();
                }
            })
            .then((result) => {
                if (result) {
                    console.log(result);
                    setPost(result);
                }
            })
            .catch((error) => {
                console.log("getPost hatası:", error);
            });
    };


    const handleClose = () => {
        setOpen(false);
        setIsOpen(false);
    };


    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        getPost();
    }, [postId])
    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Close
                    </Typography>
                </Toolbar>
            </AppBar>
            <div className={classes.div}>
                {post ? <Post likes={post.postLikes} postId={post.id} userId={post.userId} userName={post.userName}
                              title={post.title} text={post.text}></Post> : "loading"}
            </div>
        </Dialog>
    );
}


function UserActivity(props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [rows, setRows] = useState([]);
    const {userId} = props;
    const classes = useStyles();
    const [isOpen, setIsOpen] = useState();
    const [selectedPost, setSelectedPost] = useState();
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('tokenKey');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('refreshKey');
        localStorage.removeItem('userName');
        navigate(0); // navigate kullanarak sayfayı yeniden yükle
    }

    const handleNotification = (postId) => {
        setSelectedPost(postId);
        setIsOpen(true);
    };

    const getActivity = () => {
        GetWithAuth("/users/activity/" + userId)
            .then((res) => {
                if (!res.ok) {
                    // Eğer istek başarısızsa token'ı yenile
                    RefreshToken()
                        .then((res) => {
                            if (!res.ok) {
                                logout();  // Token yenileme başarısızsa çıkış yap
                            } else {
                                return res.json();
                            }
                        })
                        .then((result) => {
                            if (result) {
                                localStorage.setItem("tokenKey", result.accessToken);
                                getActivity(); // Token yenilendikten sonra tekrar dene
                            }
                        })
                        .catch((err) => {
                            console.log("Token yenileme hatası:", err);
                        });
                } else {
                    return res.json();
                }
            })
            .then((result) => {
                if (result) {
                    setIsLoaded(true);
                    console.log(result);
                    setRows(result);
                }
            })
            .catch((error) => {
                setIsLoaded(true);
                setError(error);
                console.log("getActivity hatası:", error);
            });
    };



    useEffect(() => {
        getActivity()
    }, [])


    return (
        <div>
            {isOpen ? <PopUp isOpen={isOpen} postId={selectedPost} setIsOpen={setIsOpen}/> : ""}
            <Paper className={classes.root}>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                User Activity
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => {
                                return (
                                    <Button onClick={() => handleNotification(row[1])}>
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                            <TableCell align="right">
                                                {row[3] + " " + row[0] + " your post"}
                                            </TableCell>
                                        </TableRow>
                                    </Button>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </div>
    );
}

export default UserActivity;
