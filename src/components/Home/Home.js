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
            )
    }

    useEffect(() => {
        refreshPost();
    }, [postList]);

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div className={classes.container}>
                <PostForm userId={1} userName={"name"} refreshPost={refreshPost} />
                {postList.map(post => (
                    <div key={post.id} className={classes.postWrapper}>
                        <Post userId={post.userId} userName={post.userName} title={post.title} text={post.text} />
                    </div>
                ))}
            </div>
        );
    }
}

export default Home;
