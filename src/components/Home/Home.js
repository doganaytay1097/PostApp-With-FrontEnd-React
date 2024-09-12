import React, { useEffect, useState } from 'react';
import Post from "../Post/Post";
import PostForm from "../Post/PostForm";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ebf9fa',
        minHeight: '100vh',
        padding: '20px',
        paddingTop: '80px',
        overflowY: 'auto',
        gap: '20px',
    },
    postWrapper: {
        width: '800px',
        display: 'flex',
        justifyContent: 'center',
    },
}));

function Home() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [postList, setPostList] = useState([]);
    const classes = useStyles();

    const refreshPost = () => {
        fetch("/posts")
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    setPostList(result);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            );
    };

    useEffect(() => {
        refreshPost();  // Component ilk yüklendiğinde post'ları getir
    }, []);

    if (error) {
        return <div>Hata: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Yükleniyor...</div>;
    } else {
        return (
            <div className={classes.container}>
                {localStorage.getItem('currentUser') && (
                    <PostForm
                        userId={localStorage.getItem('currentUser')}
                        userName={localStorage.getItem('userName')}
                        refreshPost={refreshPost} // PostForm'dan post atıldıktan sonra bu fonksiyon çağrılacak
                    />
                )}

                {postList.map(post => (
                    <div key={post.id} className={classes.postWrapper}>
                        <Post
                            likes={post.postLikes}
                            postId={post.id}
                            userId={post.userId}
                            userName={post.userName}
                            title={post.title}
                            text={post.text}
                        />
                    </div>
                ))}
            </div>
        );
    }
}

export default Home;
