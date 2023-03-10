import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment/moment';
import {
    TextField,
    Card,
    Button,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Box,
    IconButton,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';

const Documents = () => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [value, setValue] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [user, setUser] = useState([]);
    const [history, setHistory] = useState([]);
    const [openCheck, setOpenCheck] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [track, setTrack] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user_data');
        setUser(JSON.parse(userData));
        console.log(JSON.parse(userData));
        getData(JSON.parse(userData));
    }, []);

    function getData(value) {
        const id = value.hospital_id;
        axios
            .get(`http://localhost:7000/documents/${id}`)
            .then((response) => {
                console.log(response.data.data);
                let value = response.data.data;
                setRows(
                    value.map((item, index) =>
                        createData(
                            index + 1,
                            item.created_at,
                            item.document_code,
                            item.document_title,
                            item.document_detail,
                            item.document_file,
                            item.created_by,
                            item.document_description,
                            item.document_status
                        )
                    )
                );
            })
            .catch((error) => {
                console.error(error);
            });
    }

    // Define steps for the stepper
    const steps = ['?????????????????????????????? 1', '?????????????????????????????? 2'];
    const [activeStepDoc, setActiveStepDoc] = useState(0);

    const stepsDocuments = [
        {
            label: '????????????????????????????????????????????????????????????',
            description: ''
        },
        {
            label: '????????????????????????????????????????????????????????????',
            description: ''
        },
        {
            label: '????????????????????????????????????????????????',
            description: ``
        },
        {
            label: '?????????????????????????????????????????????????????????????????????',
            description: ``
        },
        {
            label: '???????????????????????????'
        }
    ];

    const handleNextDoc = () => {
        setActiveStepDoc((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBacktDoc = () => {
        setActiveStepDoc((prevActiveStep) => prevActiveStep - 1);
    };

    const handleResetDoc = () => {
        setActiveStepDoc(0);
    };

    const handleDeleteEquipment = (row) => {
        // setHistory(row);
        console.log('row =>', row);
    };

    const columns = [
        { id: 'order', label: '????????????????????????', minWidth: 100 },
        { id: 'date', label: '???????????????????????????', minWidth: 100 },
        { id: 'code', label: '????????????', minWidth: 100 },
        { id: 'topic', label: '??????????????????', minWidth: 100 },
        { id: 'detail', label: '??????????????????????????????', minWidth: 100 },
        { id: 'documents', label: '??????????????????', minWidth: 100 },
        { id: 'reporter', label: '???????????????????????????', minWidth: 100 },
        { id: 'description', label: '??????????????????????????????', minWidth: 100 },
        {
            id: 'status',
            label: '???????????????',
            minWidth: 100,
            render: (row) => {
                switch (row.status) {
                    case 0:
                        return '??????????????????????????????';
                    case 1:
                        return '????????????????????????????????????(????????????????????????????????????????????????????????????)';
                    case 2:
                        return '????????????????????????????????????(????????????????????????????????????????????????????????????)';
                    case 3:
                        return '????????????????????????????????????(????????????????????????????????????????????????)';
                    case 4:
                        return '????????????????????????????????????(?????????????????????????????????????????????????????????????????????)';
                    case 5:
                        return '???????????????????????????';
                    default:
                        return '';
                }
            }
        },
        {
            id: 'mange',
            label: '???????????????????????????',
            minWidth: 50,
            render: (row) => (
                <>
                    <IconButton aria-label="check" onClick={() => handleCheck(row)}>
                        <VisibilityRoundedIcon />
                    </IconButton>
                    <IconButton aria-label="delete" color="error" size="small" onClick={() => handleDeleteEquipment(row)}>
                        <DeleteIcon />
                    </IconButton>
                </>
            )
        }
    ];

    function createData(order, date, code, topic, detail, documents, reporter, description, status) {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        return { order, date: formattedDate, code, topic, detail, documents, reporter, description, status };
    }

    const handleSubmit = (event) => {
        event.preventDefault(); // prevent form submission
        const name = event.target.elements.name.value;
        const detail = event.target.elements.detail.value;
        const file = selectedFile.name;
        // ???????????????????????????????????????????????????????????????????????????????????????
        if (name && file) {
            const newValue = { name, detail, file };
            setValue([...value, newValue]);
        }
        event.target.elements.name.value = '';
        event.target.elements.detail.value = '';
        setSelectedFile(null);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleEdit = (row) => {
        // Implement the edit logic
    };

    const handleDelete = (row) => {
        console.log('row');
        // axios
        //     .post('http://localhost:7000/document', {
        //         topic: name,
        //     })
        //     .then(function (response) {
        //         const value = response.data;
        //         if (value.status == 'ok') {
        //             //
        //         }
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setSelectedFile(null);
        setValue([]);
        setOpen(false);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleNext = (event) => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = (event) => {
        setSelectedFile(null);
        setValue([]);
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSaveForm = async () => {
        console.log('save form', value);
        await randomTrack();
        await axios
            .post('http://localhost:7000/document', {
                code: track,
                title: value[0].name,
                detail: value[0].detail,
                file: value[0].file,
                name: user.user_firstname + ' ' + user.user_lastname,
                hospital: user.hospital_id
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
        setValue([]);
    };

    const handleCheck = (row) => {
        setHistory(row);
        console.log('row =>', row);
        setOpenCheck(true);
    };

    const handleCloseCheck = () => {
        setOpenCheck(false);
    };

    const randomTrack = () => {
        var track = `DOC-${user.hospital_id}${moment().format('YYYYMMDDHHmmss')}`;
        setTrack(track);
    };

    return (
        <div>
            <Card sx={{ minWidth: 275, minHeight: 625 }}>
                <Typography variant="h3" sx={{ fontWeight: 500, textAlign: 'center', marginTop: '20px' }}>
                    ??????????????????????????????????????????
                </Typography>
                <Button
                    variant="contained"
                    sx={{ float: 'right', marginRight: '20px', marginTop: '20px', marginBottom: '20px' }}
                    onClick={handleClickOpen}
                >
                    ?????????????????????????????????
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
                    {/* <Button variant="contained" sx={{ float: 'left', marginBottom: '20px' }}>
                        Export
                    </Button> */}
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
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
                        <Typography variant="h3" sx={{ fontWeight: 500 }}>
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
                                    label="??????????????????????????????"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                />
                                <TextField
                                    margin="dense"
                                    id="detail"
                                    name="detail"
                                    label="??????????????????????????????"
                                    multiline
                                    rows={4}
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                />
                                <p>
                                    ?????????????????????????????????:
                                    {selectedFile ? <span> {selectedFile.name}</span> : <span>No file selected</span>}
                                    {selectedFile ? (
                                        ''
                                    ) : (
                                        <Button variant="contained" component="label" sx={{ marginLeft: '20px' }}>
                                            ?????????????????????
                                            <input type="file" id="file" name="file" hidden onChange={handleFileChange} />
                                        </Button>
                                    )}
                                </p>
                                {/* <Box textAlign="center" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                                    <Button type="submit">?????????????????????????????????</Button>
                                </Box> */}
                                {equipment.length > 0 ? (
                                    <>
                                        <Typography variant="h3" sx={{ fontWeight: 500 }}>
                                            ???????????????????????????????????????
                                        </Typography>
                                        <ol>
                                            {equipment.map((item, key) => (
                                                <li key={key}>
                                                    {item.name} ???????????????: {item.detail} file: {item.file}
                                                    {/* <button onClick={() => handleDeleteEquipment(key)}>??????</button> */}
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
                                    <Button type="submit">???????????????</Button>
                                </Box>
                            </form>
                        )}
                        {activeStep === 1 && (
                            <>
                                <Typography variant="h3" sx={{ fontWeight: 500, textAlign: 'center', marginTop: '20px' }}>
                                    ???????????????????????????????????????
                                </Typography>
                                {value.map((item, key) => (
                                    <div key={key}>
                                        <p>??????????????????????????????: {item.name}</p>
                                        <p>??????????????????????????????: {item.detail}</p>
                                        <p>?????????????????????????????????: {item.file}</p>
                                    </div>
                                ))}
                                <DialogActions>
                                    <Button onClick={handleBack}>????????????????????????</Button>
                                    <Button onClick={handleSaveForm}>??????????????????</Button>
                                </DialogActions>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                <Dialog
                    fullWidth={true}
                    maxWidth={'sm'}
                    open={openCheck}
                    onClose={handleCloseCheck}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        <p style={{ fontSize: '26px' }}>????????????????????????????????????????????????</p>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <Grid>
                                <p style={{ fontSize: '20px' }}>??????????????????????????????: {history.code}</p>
                            </Grid>
                            <Grid>
                                <p style={{ fontSize: '20px' }}>???????????? - ?????????????????????: {history.reporter}</p>
                            </Grid>
                            <Grid>
                                <p style={{ fontSize: '20px' }}>?????????????????????????????????????????????: {history.date}</p>
                            </Grid>
                            <Grid>
                                <p style={{ fontSize: '20px' }}>????????????????????????????????????: {history.topic}</p>
                            </Grid>
                            <Grid>
                                <p style={{ fontSize: '20px' }}>????????????????????????????????????: {history.documents}</p>
                            </Grid>
                        </DialogContentText>

                        <Box sx={{ maxWidth: 400 }}>
                            <Stepper activeStep={activeStepDoc} orientation="vertical">
                                {stepsDocuments.map((step, index) => (
                                    <Step key={step.label}>
                                        <StepLabel optional={index === 4 ? <Typography variant="caption">Last step</Typography> : null}>
                                            <p style={{ fontSize: '18px' }}>{step.label}</p>
                                            {/* {step.label} */}
                                        </StepLabel>
                                        {/* <StepContent>
                                            <Typography>{step.description}</Typography>
                                            <Box sx={{ mb: 2 }}>
                                                <div>
                                                    <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                                                        {index === stepsDocuments.length - 1 ? 'Finish' : 'Continue'}
                                                    </Button>
                                                    <Button disabled={index === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                                                        Back
                                                    </Button>
                                                </div>
                                            </Box>
                                        </StepContent> */}
                                    </Step>
                                ))}
                            </Stepper>
                            {activeStepDoc === stepsDocuments.length && (
                                <Paper square elevation={0} sx={{ p: 3 }}>
                                    <Typography>All steps completed - you&apos;re finished</Typography>
                                    <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                                        Reset
                                    </Button>
                                </Paper>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseCheck}>?????????</Button>
                    </DialogActions>
                </Dialog>
            </Card>
        </div>
    );
};

export default Documents;
