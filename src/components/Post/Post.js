import React, { useEffect, useState, useRef } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import { makeStyles } from '@mui/styles';
import {Link, useNavigate} from "react-router-dom";
import { Container } from "@mui/material";
import Comment from '../Comment/Comment';
import CommentForm from "../Comment/CommentForm";
import {DeleteWithAuth, PostWithAuth,RefreshToken} from "../../services/HttpService";

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
    cardActions: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center', // Dikey hizalama
    },
    expandMore: {
        marginLeft: 'auto',
    },
    likeContainer: {
        display: 'flex',
        alignItems: 'center',  // Kalp ve sayıyı yatayda hizalama
    },
    likeCount: {
        marginLeft: '4px',  // Kalp simgesinin hemen yanında olması için az bir boşluk
    },
}));

function Post(props) {
    const { title, text, userId, postId, likes,userName } = props;
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [commentList, setCommentList] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const isInitialMount = useRef(true);
    const [likeCount, setLikeCount] = useState(likes.length);
    const [likeId, setLikeId] = useState(null);
    const [refresh, setRefresh] = useState(false);
    let disabled = localStorage.getItem("currentUser") == null ? true : false;
    const navigate = useNavigate();

    const setCommentRefresh = () => {
        setRefresh(true);
    }

    const handleExpandClick = () => {
        setExpanded(!expanded);
        refreshComments();
        console.log(commentList);
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        if (!isLiked) {
            saveLike();
            setLikeCount(likeCount + 1)
        }
        else {
            deleteLike();
            setLikeCount(likeCount - 1)
        }
    }

    const logout = () => {
        localStorage.removeItem('tokenKey');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('refreshKey');
        localStorage.removeItem('userName');
        navigate(0); // navigate kullanarak sayfayı yeniden yükle
    }

    const refreshComments = () => {
        fetch(`/comments?postId=${postId}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Yorumları alırken bir hata oluştu.');
                }
                return res.json();
            })
            .then(
                (result) => {
                    console.log("Yorumlar getirildi:", result); // Debugging log
                    setIsLoaded(true);
                    setCommentList(result);
                },
                (error) => {
                    console.error("Yorumlar alınırken hata oluştu:", error);
                    setIsLoaded(true);
                    setError(error);
                }
            )
            .catch((err) => {
                console.error("Beklenmeyen bir hata:", err);
                setIsLoaded(true);
                setError(err);
            });

        setRefresh(false);
    };

    const saveLike = () => {
        PostWithAuth("/likes", {
            postId: postId,
            userId: localStorage.getItem("currentUser"),
        })
            .then((res) => {
                if (!res.ok) {
                    // Eğer token geçersizse yenileme işlemi başlat
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
                                localStorage.setItem("tokenKey", result.accessToken); // Token'ı güncelle
                                saveLike(); // saveLike'ı tekrar dene
                            }
                        })
                        .catch((err) => {
                            console.log("Token yenileme hatası:", err);
                        });
                } else {
                    return res.json();
                }
            })
            .catch((err) => {
                console.log("saveLike hatası:", err);
            });
    };


    const deleteLike = () => {
        DeleteWithAuth("/likes/" + likeId)
            .then((res) => {
                if (!res.ok) {
                    // Eğer token geçersizse token'ı yenile
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
                                localStorage.setItem("tokenKey", result.accessToken); // Token'ı güncelle
                                deleteLike(); // deleteLike'ı tekrar dene
                            }
                        })
                        .catch((err) => {
                            console.log("Token yenileme hatası:", err);
                        });
                } else {
                    return res.json();
                }
            })
            .catch((err) => {
                console.log("deleteLike hatası:", err);
            });
    };


    const checkLikes = () => {
        var likeControl = likes.find((like => ""+like.userId === localStorage.getItem("currentUser")));
        if (likeControl != null) {
            setLikeId(likeControl.id);
            setIsLiked(true);
        }
    };

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            checkLikes(); // İlk yüklemede beğenileri kontrol et
        } else {
            refreshComments(); // Yorumları yenile
        }
    }, [refresh]);

    useEffect(() => {
        checkLikes();
    }, []);

    return (
        <div style={{ width: '800px', marginBottom: '20px' }}>
            <Card className={classes.card}>
                <CardHeader
                    avatar={
                        <Link to={`/users/${userId}`} className={classes.link}>
                            <Avatar className={classes.avatar} aria-label="recipe">
                                {userName ? userName.charAt(0).toUpperCase() : '!'}
                            </Avatar>
                        </Link>
                    }
                    title={
                        <Typography variant="h6" sx={{ textAlign: 'left' }}>
                            {title}
                        </Typography>
                    }
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                        {text}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing className={classes.cardActions}>
                    <div className={classes.likeContainer}>
                        <IconButton
                            onClick={handleLike}
                            aria-label="add to favorites"
                            disabled={disabled}
                        >
                            <FavoriteIcon style={isLiked ? { color: "red" } : null} />
                        </IconButton>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            className={classes.likeCount}
                        >
                            {likeCount}
                        </Typography>
                    </div>
                    <IconButton
                        className={classes.expandMore}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <CommentIcon />
                    </IconButton>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Container fixed className={classes.container}>
                        {error ? (
                            <Typography color="error">{error.message}</Typography>
                        ) : !isLoaded ? (
                            "Yükleniyor..."
                        ) : commentList.length === 0 ? (
                            "Henüz yorum yok"
                        ) : (
                            commentList.map((comment) => (
                                <Comment key={comment.id} userId={comment.userId} userName={comment.userName} text={comment.text} />
                            ))
                        )}
                        {!disabled && (
                            <CommentForm userId={localStorage.getItem("currentUser")}  postId={postId} setCommentRefresh={setCommentRefresh} userName={localStorage.getItem("userName")}  />
                        )}
                    </Container>
                </Collapse>
            </Card>
        </div>
    );
}

export default Post;
