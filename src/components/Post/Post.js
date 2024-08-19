import React, { useState } from 'react';
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
import { Link } from "react-router-dom";

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
        justifyContent: 'space-between', // Favori ve Comment ikonları arasındaki boşluğu sağlar
    },
    expandMore: {
        marginLeft: 'auto', // Comment ikonu en sağa yerleştiriliyor
    },
}));

function Post(props) {
    const { userId, userName, title, text } = props;
    const [expanded, setExpanded] = useState(false);
    const [liked, setLiked] = useState(false);
    const classes = useStyles();

    const handleLike = () => {
        setLiked(!liked);
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <div style={{ width: '800px', marginBottom: '20px' }}>
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
                    <IconButton
                        onClick={handleLike}
                        aria-label="add to favorites">
                        <FavoriteIcon style={!liked ? null : { color: "red" }} />
                    </IconButton>
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
                    <CardContent>
                        {/* Ekstra içerik buraya eklenebilir */}
                    </CardContent>
                </Collapse>
            </Card>
        </div>
    );
}

export default Post;
