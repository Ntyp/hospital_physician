import React, { useState, useEffect } from 'react';
import moment from 'moment/moment';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    Typography,
    Button,
    Modal,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Stepper,
    Step,
    StepLabel
} from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import QrCode2Icon from '@mui/icons-material/QrCode2';

const Tracking = () => {
    const [user, setUser] = useState();
    const [rows, setRows] = useState([]);
    const [showItem, setShowItem] = useState([]);
    const [open, setOpen] = useState(false);
    const [openCheck, setOpenCheck] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [page, setPage] = useState(0);
    const [equipment, setEquipment] = useState([]);
    const [track, setTrack] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [history, setHistory] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user_data');
        const storage = JSON.parse(userData);
        setUser(storage);
        getData(storage);
    }, []);

    function getData(value) {
        const id = value.user_id;
        axios
            .get(`http://localhost:7000/tracking/${id}`)
            .then((response) => {
                console.log(response.data.data);
                const value = response.data.data;
                setRows(value.map((item, index) => createData(index + 1, item.date_at, item.group_id, item.tracking_status)));
            })
            .catch((error) => {
                console.error(error);
            });
    }

    // ??????????????????????????????????????????????????????????????? API
    function createData(date, code, status) {
        return { date, code, status };
    }

    const steps = ['?????????????????????????????? 1', '?????????????????????????????? 2'];

    // ?????????????????????????????????????????????????????????????????????????????????????????????????????????
    const handleCheck = (row) => {
        const track = row.track;
        console.log('???? ~ file: Tracking.js:80 ~ handleCheck ~ track:', track);
        axios
            .get(`http://localhost:7000/tracking-data/${track}`)
            .then((response) => {
                console.log(response.data.data[0]);
                setHistory(response.data.data[0]);
            })
            .catch((error) => {
                console.error(error);
            });

        axios
            .get(`http://localhost:7000/tracking-item/${track}`)
            .then((response) => {
                console.log('item', response.data.data);
                setShowItem(response.data.data);
            })
            .catch((error) => {
                console.error(error);
            });

        console.log('row =>', row);
        setOpenCheck(true);
    };

    const handleQrcode = (row) => {
        console.log('row =>', row);
        navigate('/tracking-qrcode', { state: { params: row.track } });
    };

    // ??????????????????????????? columns
    const columns = [
        { id: 'order', label: '????????????????????????', minWidth: 100 },
        { id: 'date', label: '???????????????????????????', minWidth: 100 },
        { id: 'track', label: '?????????????????????', minWidth: 100 },
        { id: 'status', label: '???????????????', minWidth: 100 },
        {
            id: 'check',
            label: '?????????????????????',
            minWidth: 50,
            render: (row) => (
                <>
                    <IconButton aria-label="check" onClick={() => handleCheck(row)}>
                        <VisibilityRoundedIcon />
                    </IconButton>
                    <IconButton aria-label="check" onClick={() => handleQrcode(row)}>
                        <QrCode2Icon />
                    </IconButton>
                </>
            )
        }
    ];

    // ???????????????????????????????????????????????????
    function createData(order, date, track, status) {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        return { order, date: formattedDate, track, status };
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleClickOpen = () => {
        setOpen(true);
        randomTrack();
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleEdit = (row) => {
        // Implement the edit logic
    };

    const handleDelete = (row) => {
        // Implement the delete logic
    };

    const handleNextPage = () => {
        // Next Page
    };

    const handleSaveForm = () => {
        axios
            .post('http://localhost:7000/create-tracking', {
                id: track,
                items: equipment,
                count: equipment.length,
                sender: user.user_firstname + ' ' + user.user_lastname,
                date: moment().format('YYYY-MM-DD'),
                user_id: user.user_id,
                hospital: user.hospital_id,
                place: user.user_place
            })
            .then(function (response) {
                const value = response.data;
                if (value.status == 'ok') {
                    //
                }
            })
            .catch(function (error) {
                console.log(error);
            });

        setOpen(false);
        setActiveStep(0);
        setEquipment([]);
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // prevent form submission
        const name = event.target.elements.name.value;
        const quantity = event.target.elements.quantity.value;

        // ???????????????????????????????????????????????????????????????????????????????????????
        if (name && quantity) {
            const newEquipment = { name, quantity };
            setEquipment([...equipment, newEquipment]);

            // reset the form fields
            event.target.elements.name.value = '';
            event.target.elements.quantity.value = '';
        } else {
            // ???????????????????????????
        }
    };

    const handleDeleteEquipment = (key) => {
        // Remove the item from the equipment array using its key value as the index
        setEquipment((prevEquipment) => prevEquipment.filter((item, index) => index !== key));
    };

    // const randomTrack = () => {
    //     var track = `BPTH` + Math.floor(Math.random() * 90000);
    //     setTrack(track);
    // };

    const randomTrack = () => {
        var track = `BPTH-${user.hospital_id}${moment().format('YYYYMMDDHHmmss')}`;
        setTrack(track);
    };

    const handleClickOpenCheck = () => {
        setOpenCheck(true);
    };

    const handleCloseCheck = () => {
        setOpenCheck(false);
    };

    const handleNext = () => {
        if (equipment.length > 0) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleClickOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    return (
        <div>
            <Card sx={{ minWidth: 275, minHeight: 650 }}>
                <Typography variant="h3" sx={{ fontWeight: 500, textAlign: 'center', marginTop: '20px' }}>
                    ?????????????????????????????????????????????
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleClickOpen}
                    sx={{ float: 'right', marginRight: '20px', marginTop: '20px', marginBottom: '20px' }}
                >
                    ????????????????????????????????????
                </Button>
                <Paper
                    sx={{
                        width: '100%',
                        overflow: 'hidden',
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '30px'
                    }}
                >
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell key={column.id} align="center" style={{ minWidth: column.minWidth }}>
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.order}>
                                        {columns.map((column) => (
                                            <TableCell key={column.id} align="center">
                                                {column.render ? column.render(row) : row[column.id]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>
                        <Typography variant="h3" sx={{ fontWeight: 500, textAlign: 'center' }}>
                            ?????????????????????????????????????????????????????????????????????
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Stepper activeStep={activeStep}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        {activeStep === 0 && (
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    margin="dense"
                                    id="name"
                                    name="name"
                                    label="?????????????????????????????????"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    sx={{ marginTop: '20px', marginBottom: '10px' }}
                                />
                                <TextField
                                    margin="dense"
                                    id="quantity"
                                    name="quantity"
                                    label="???????????????"
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                />
                                <Box textAlign="center" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                                    <Button type="submit">???????????????????????????????????? +</Button>
                                </Box>
                                {equipment.length > 0 ? (
                                    <>
                                        <Typography variant="h3" sx={{ fontWeight: 500 }}>
                                            ???????????????????????????????????????
                                        </Typography>
                                        <ol>
                                            {equipment.map((item, key) => (
                                                <li key={key}>
                                                    {item.name} ???????????????: {item.quantity}
                                                    <IconButton onClick={() => handleDeleteEquipment(key)} color="error" size="small">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </li>
                                            ))}
                                        </ol>
                                    </>
                                ) : (
                                    ''
                                )}
                                <Box textAlign="center" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                                    <Button onClick={handleClose}>????????????????????????</Button>
                                    <Button type="submit" onClick={handleNext}>
                                        ???????????????
                                    </Button>
                                </Box>
                            </form>
                        )}
                        {activeStep === 1 && (
                            <>
                                <Typography variant="h3" sx={{ fontWeight: 500, textAlign: 'center', marginTop: '20px' }}>
                                    ???????????????????????????????????????
                                </Typography>
                                <ol>
                                    {equipment.map((item, key) => (
                                        <li key={key}>
                                            {item.name} ???????????????: {item.quantity}
                                        </li>
                                    ))}
                                </ol>
                                <DialogActions>
                                    <Button onClick={handleBack}>????????????????????????</Button>
                                    <Button onClick={handleSaveForm}>??????????????????</Button>
                                </DialogActions>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={openCheck}
                    fullWidth={true}
                    maxWidth={'sm'}
                    onClose={handleCloseCheck}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        <h3 style={{ fontSize: '25px' }}>???????????????????????????????????????</h3>
                        <hr />
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <p style={{ fontSize: '18px' }}>??????????????????????????????:{history.tracking_sender}</p>
                            <p style={{ fontSize: '18px' }}>?????????????????????: {history.group_id}</p>
                            <p style={{ fontSize: '18px' }}>???????????????????????????: {moment(history.date_at).format('YYYY-MM-DD')}</p>
                            <p style={{ fontSize: '18px' }}>???????????????????????????????????????:</p>
                            <ol>
                                {showItem.map((item, key) => (
                                    <li style={{ fontSize: '18px' }} key={key}>
                                        {item.equipment_name} ???????????????: {item.equipment_quantity}
                                    </li>
                                ))}
                            </ol>
                            <p style={{ fontSize: '18px' }}>???????????????: {history.tracking_status}</p>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseCheck}>?????????</Button>
                    </DialogActions>
                </Dialog>
            </Card>
        </div>
    );
};

export default Tracking;
