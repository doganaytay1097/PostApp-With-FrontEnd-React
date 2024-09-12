import React, {useState} from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import {Button, OutlinedInput, InputAdornment, Snackbar, Alert} from "@mui/material";
import {makeStyles} from '@mui/styles';
import {Link, useNavigate} from "react-router-dom";
import {PostWithAuth, RefreshToken} from "../../services/HttpService";

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
    const {userId, refreshPost,userName} = props;
    const navigate = useNavigate();
    const classes = useStyles();
    const [text, setText] = useState("");
    const [title, setTitle] = useState("");
    const [isSent, setIsSent] = useState(false);

    const savePost = () => {
        PostWithAuth("/posts", {
            title: title,
            userId: userId,
            text: text,
        })
            .then((res) => {
                if (!res.ok) {
                    // Eğer istek başarısızsa, token süresi dolmuş olabilir.
                    RefreshToken()
                        .then((res) => {
                            if (!res.ok) {
                                logout(); // Token yenileme başarısızsa çıkış yap
                            } else {
                                return res.json();
                            }
                        })
                        .then((result) => {
                            if (result) {
                                localStorage.setItem("tokenKey", result.accessToken); // Yeni token'ı kaydet
                                savePost(); // Token yenilendikten sonra tekrar savePost çağrılır
                            }
                        })
                        .catch((err) => {
                            console.log("Token yenileme hatası:", err);
                        });
                } else {
                    return res.json(); // Eğer istek başarılıysa yeni postu dönüyoruz
                }
            })
            .then((newPost) => {
                if (newPost) {
                    refreshPost(newPost); // Yeni postu Home bileşenine iletiyoruz
                    setIsSent(true);
                    setTitle("");
                    setText("");
                }
            })
            .catch((err) => {
                console.log("savePost hatası:", err);
            });
    };


    const logout = () => {
        localStorage.removeItem('tokenKey');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('refreshKey');
        localStorage.removeItem('userName');
        navigate(0); // navigate kullanarak sayfayı yeniden yükle
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
                    Gönderiniz gönderildi.
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
                                placeholder="Başlık"
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
                            placeholder="Metin"
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
                                        Gönder
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
