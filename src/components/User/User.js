import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import AvatarCard from "../Avatar/Avatar";
import UserActivity from "../UserActivity/UserActivity";
import {makeStyles} from "@mui/styles";
import {GetWithAuth, RefreshToken} from "../../services/HttpService";

const useStyles = makeStyles({
    root: {
        display: "flex",
        justifyContent: "space-between",
        marginLeft: '20px',
        marginRight: '40px',
    },
    avatarSection: {
        flex: '1 1 25%', // AvatarCard bileşeni için %25 genişlik
        marginRight: '', // Aradaki boşluk
    },
    activitySection: {
        flex: '1 1 100%', // UserActivity bileşeni için %70 genişlik
    }
});

function User() {
    const {userId} = useParams();
    const classes = useStyles();
    const [user, setUser] = useState();
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('tokenKey');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('refreshKey');
        localStorage.removeItem('userName');
        navigate(0); // navigate kullanarak sayfayı yeniden yükle
    }

    const getUser = () => {
        GetWithAuth("/users/" + userId)
            .then((res) => {
                if (!res.ok) {
                    // Eğer token geçersizse yenileme işlemi başlat
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
                                getUser(); // Yenilendikten sonra kullanıcıyı tekrar al
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
                    setUser(result);
                }
            })
            .catch((error) => {
                console.log("getUser hatası:", error);
            });
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <div className={classes.root}>
            <div className={classes.avatarSection}>
                {user? <AvatarCard avatarId={user.avatarId} userId={userId} userName={user.userName}/> :""}
            </div>
            <div className={classes.activitySection}>
                {localStorage.getItem("currentUser") == userId ?<UserActivity userId={userId} /> : ""}
            </div>
        </div>
    )
}

export default User;
