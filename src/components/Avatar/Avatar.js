import React from 'react';
import { makeStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Modal, Radio, List, ListItemSecondaryAction, ListItem} from "@mui/material";
import {PutWithAuth, RefreshToken} from "../../services/HttpService";
import {useNavigate} from "react-router-dom";

const useStyles = makeStyles({
    card: {
        maxWidth: 345,
        transform: 'scale(0.8)',  // %20 küçültme
        alignSelf: 'flex-start',
        // Navbar ile arasındaki mesafeyi ayarlamak için margin ekleyebilirsiniz
    },
    media: {
        height: 400,
    },
    modalStyle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        backgroundColor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        padding: 16,
    },
    list: {
        display: 'flex',
        flexDirection: 'column', // Avatarları dikey sıralamak için eklendi
        justifyContent: 'space-between', // Düzgün bir şekilde dağıtmak için eklendi
        height: '100%', // Liste yüksekliğini tam yapmak için eklendi
        padding: 8,
    },
    modal:{
        display: 'flex',
        maxWidth: 200
    },
    avatarItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    actions: {
        display: 'flex',
        justifyContent: 'center',  // Butonu ortalamak için
    },
});

function AvatarCard(props) {
    const {avatarId,userId,userName} = props;
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(avatarId);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('tokenKey');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('refreshKey');
        localStorage.removeItem('userName');
        navigate(0); // navigate kullanarak sayfayı yeniden yükle
    }

    const saveAvatar = () => {
        PutWithAuth(`/users/${localStorage.getItem("currentUser")}`, {
            avatar: selectedValue,  // Sadece avatar alanını gönderiyoruz
        })
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
                                localStorage.setItem("tokenKey", result.accessToken); // Yeni token'ı kaydet
                                saveAvatar();  // Yenilenen token ile tekrar dene
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
                console.log("Avatar güncellenirken hata oluştu:", err);
            });
    };



    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        saveAvatar();
    };

    return (
        <div>
            <Card className={classes.card}>
                <CardMedia
                    className={classes.media}
                    image={`/avatars/avatar${selectedValue}.png`}
                    title="User Avatar"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {userName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        User Info
                    </Typography>
                </CardContent>
                <CardActions className={classes.actions}>
                    {localStorage.getItem("currentUser") == userId ? <Button onClick={handleOpen}>Change Avatar</Button> : ""}
                    <Modal
                        className={classes.modal}
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                    >
                        <List dense className={classes.list}>
                            {[1, 2, 3, 4, 5, 6].map((key) => {
                                const labelId = `checkbox-list-secondary-label-${key}`;
                                return (
                                    <ListItem key={key} className={classes.avatarItem} button>
                                        <CardMedia
                                            style={{ maxWidth: 150 }}
                                            component="img"
                                            alt={`Avatar n°${key}`}
                                            image={`/avatars/avatar${key}.png`}
                                            title="User Avatar"
                                        />
                                        <ListItemSecondaryAction>
                                            <Radio
                                                edge="end"
                                                value={key}
                                                color={'secondary'}
                                                onChange={handleChange}
                                                checked={"" + selectedValue === "" + key}
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Modal>
                </CardActions>
            </Card>
        </div>
    );
}

export default AvatarCard;
