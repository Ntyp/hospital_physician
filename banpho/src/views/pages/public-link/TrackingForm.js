import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../../assets/images/logo.png';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    FormControlLabel,
    Grid,
    Typography,
    Container,
    Box,
    Link,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    ListItemIcon
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import moment from 'moment/moment';
import axios from 'axios';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
// import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

const theme = createTheme();

const TrackingForm = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const track = searchParams.get('track');
    const [data, setData] = useState();
    const [recipient, setRecipient] = useState();
    const [date, setDate] = useState();
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openPickup, setOpenPickup] = useState(false);
    const [status, setStatus] = useState();
    const navigate = useNavigate();
    const [meetDate, setMeetDate] = useState();
    useEffect(() => {
        axios
            .get(`http://localhost:7000/tracking-data/${track}`)
            .then((response) => {
                console.log(response.data.data[0]);
                const value = response?.data?.data[0];
                setData(value);
                setStatus(value.tracking_status);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const styles = {
        fontFamily: 'Kanit, sans-serif'
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const recipient = event.target.elements.recipient.value;
        const date = event.target.elements.date.value;
        setRecipient(recipient);
        setDate(date);
        setOpenConfirm(true);
    };

    const handlePickup = (event) => {
        event.preventDefault();
        const date = event.target.elements.date.value;
        setDate(date);
        setOpenPickup(true);
    };

    const handleGetBack = (event) => {
        axios
            .put(`http://localhost:7000/tracking-back/${track}`)
            .then(function (response) {
                window.open('about:blank', '_self');
                window.close();
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const handleClickOpen = () => {
        setOpenConfirm(true);
    };

    const handleClose = () => {
        setOpenConfirm(false);
    };

    const handleAccept = () => {
        if (date) {
            axios
                .put(`http://localhost:7000/tracking/${track}`, {
                    recipient: recipient,
                    date: date
                })
                .then(function (response) {
                    if (response.status == 'ok') {
                        setOpenConfirm(false);
                        console.log('hello');
                        window.open('about:blank', '_self');
                        window.close();
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            axios
                .put(`http://localhost:7000/tracking/${track}`, {
                    recipient: recipient,
                    date: null
                })
                .then(function (response) {
                    if (response.status == 'ok') {
                        setOpenConfirm(false);
                        window.open('about:blank', '_self');
                        window.close();
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    };

    const handleAcceptPickup = () => {
        axios
            .put(`http://localhost:7000/tracking-date/${track}`, {
                date: date
            })
            .then(function (response) {
                if (response.status == 'ok') {
                    setOpenPickup(false);
                    console.log('hello');
                    window.open('about:blank', '_self');
                    window.close();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    return status == '??????????????????????????????????????????????????????????????????????????????' ? (
        <ThemeProvider theme={styles}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <img src={logo} alt="logo" style={{ width: 200, marginBottom: 20 }} />

                    <p style={{ fontSize: '26px' }}>????????????????????????????????????????????????????????????????????????</p>
                    <p style={{ fontSize: '18px', textAlign: 'center' }}>{data.tracking_hospital}</p>
                    <p style={{ fontSize: '18px' }}>{track}</p>

                    <form onSubmit={handleSubmit}>
                        <Box>
                            <TextField
                                sx={{ mt: 2 }}
                                margin="normal"
                                required
                                fullWidth
                                id="recipient"
                                label="??????????????????????????????"
                                name="recipient"
                                color="success"
                            />
                            <TextField
                                id="date"
                                name="date"
                                label="????????????????????????????????????????????????"
                                type="date"
                                color="success"
                                fullWidth
                                sx={{ mt: 2 }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                            <p style={{ color: '#dd2c00' }}>* ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</p>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 1,
                                    mb: 1,
                                    backgroundColor: '#357a38',
                                    '&:hover': {
                                        backgroundColor: '#43a047'
                                    }
                                }}
                            >
                                ?????????????????????????????????????????????????????????
                            </Button>
                        </Box>
                    </form>
                </Box>
                <Dialog open={openConfirm} onClose={handleClose} aria-describedby="alert-dialog-description">
                    <DialogTitle>
                        <ListItemIcon>
                            <CheckCircleOutlineOutlinedIcon sx={{ fontSize: '7rem', color: '#357a38' }} />
                        </ListItemIcon>
                        <Typography variant="h5">?????????????????????????????????????????????????????????</Typography>
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={handleClose}>??????????????????</Button>
                        <Button onClick={handleAccept}>??????????????????</Button>
                    </DialogActions>
                </Dialog>
                ;
            </Container>
        </ThemeProvider>
    ) : status === '?????????????????????????????????????????????' ? (
        <ThemeProvider theme={styles}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <img src={logo} alt="logo" style={{ width: 200, marginBottom: 20 }} />

                    <p style={{ fontSize: '26px' }}>??????????????????????????????????????????????????????????????????</p>
                    <p style={{ fontSize: '18px', textAlign: 'center' }}>{data.tracking_hospital}</p>
                    <p style={{ fontSize: '18px' }}>{track}</p>

                    <form onSubmit={handlePickup}>
                        <Box>
                            <TextField
                                id="date"
                                name="date"
                                label="????????????????????????????????????????????????"
                                type="date"
                                color="success"
                                fullWidth
                                sx={{ mt: 2 }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 3,
                                    backgroundColor: '#357a38',
                                    '&:hover': {
                                        backgroundColor: '#43a047'
                                    }
                                }}
                            >
                                ??????????????????????????????????????????????????????????????????
                            </Button>
                        </Box>
                    </form>
                </Box>
                <Dialog open={openPickup} onClose={handleClose} aria-describedby="alert-dialog-description">
                    <DialogTitle>
                        <ListItemIcon>
                            <CheckCircleOutlineOutlinedIcon sx={{ fontSize: '7rem', color: '#357a38' }} />
                        </ListItemIcon>
                        <Typography variant="h5">?????????????????????????????????????????????????????????</Typography>
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={handleClose}>??????????????????</Button>
                        <Button onClick={handleAcceptPickup}>??????????????????</Button>
                    </DialogActions>
                </Dialog>
                ;
            </Container>
        </ThemeProvider>
    ) : (
        <ThemeProvider theme={styles}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />

                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <img src={logo} alt="logo" style={{ width: 200, marginBottom: 20 }} />
                    <p style={{ fontSize: '26px' }}>?????????????????????????????????????????????</p>
                    {/* <p style={{ fontSize: '18px', textAlign: 'center' }}>{data.tracking_hospital}</p> */}
                    <p style={{ fontSize: '18px' }}>{track}</p>
                    <Box sx={{ mt: 1 }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                display: 'block',
                                displayPrint: 'none',
                                margin: '0 auto',
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: '#357a38',
                                '&:hover': {
                                    backgroundColor: '#43a047'
                                }
                            }}
                            onClick={handleGetBack}
                        >
                            ?????????????????????????????????????????????
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default TrackingForm;
