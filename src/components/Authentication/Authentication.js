import React, { useState } from 'react';
import {Button, FormControl, Input, InputLabel, Box, FormHelperText, Alert, Snackbar} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { makeStyles } from "@mui/styles";
import {PostWithAuth, PostWithOutAuth} from "../../services/HttpService";

const useStyles = makeStyles(() => ({
    root: {
        marginTop: "100px",
    },
}));

function Authentication() {

    const classes = useStyles();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [isSent, setIsSent] = useState(false);

    const handleUserName = (value) => {
        setUserName(value);
    };

    const handlePassword = (value) => {
        setPassword(value);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setIsSent(false);
    };

    const handleRegister = () => {
        sendRequest("register")
            .then(result => {
                // Kayıt başarılıysa sayfa yenilenir, ama kullanıcı giriş yapmaz
                setUserName("");
                setPassword("");
                window.location.reload(); // Sayfayı yenile
                setIsSent(true);
            })
            .catch(err => {
                console.error("Kayıt sırasında hata oluştu:", err);
                setError("Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.");
            });
    };

    const handleLogin = () => {
        sendRequest("login")
            .then(result => {
                localStorage.setItem("tokenKey", result.accessToken);
                localStorage.setItem("refreshKey", result.refreshToken);
                localStorage.setItem("currentUser", result.userId);
                localStorage.setItem("userName", userName);
                navigate('/'); // Başarılı girişte anasayfaya yönlendirme
            })
            .catch(err => {
                console.error("Giriş sırasında hata oluştu:", err);
                setError("Giriş sırasında bir hata oluştu. Lütfen kullanıcı adınızı ve şifrenizi kontrol edin.");
            });
    };

    const sendRequest = (path) => {
        return PostWithOutAuth("/auth/" + path,{
            userName: userName,
            password: password,
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            });
    };


    return (
        <div className={classes.root}>
            <Snackbar open={isSent} autoHideDuration={1800} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Başarıyla kayıt yapıldı
                </Alert>
            </Snackbar>
            <FormControl>
                <InputLabel>Username</InputLabel>
                <Input  onChange = {(i) => handleUserName(i.target.value)}/>
                <InputLabel  style={{top: 90}}>Password</InputLabel>
                <Input  style={{top: 40}}
                        onChange = {(i) => handlePassword(i.target.value)} type="password"/>
                <Button variant = "contained"
                        style = {{marginTop : 60,
                            background :'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            color : 'white'}}
                        onClick= {handleRegister}>Register</Button>
                <FormHelperText style={{margin:20}}>Are you already registered?</FormHelperText>
                <Button variant = "contained"
                        style = {{
                            background :'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            color : 'white'}}
                        onClick={handleLogin}>Login</Button>
                {error && <FormHelperText error>{error}</FormHelperText>}
            </FormControl>
        </div>
    )
}

export default Authentication;
