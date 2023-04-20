import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { blockAll, cloakerApi, getCountries, setURL, updateBlock } from 'api/api';
import Modal from '@mui/material/Modal';
import Swal from 'sweetalert2';
import CryptoJS from 'crypto-js';
import advertisement from '../../assets/images/users/advertisement.PNG';

// const crypto = require('crypto');

function hash(data) {
    return sha256(data).toString();
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4
};

function createData(name, calories, fat, carbs, protein) {
    return {
        name,
        calories,
        fat,
        carbs,
        protein
    };
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Country Key'
    },
    {
        id: 'calories',
        numeric: true,
        disablePadding: false,
        label: 'Country Name'
    },
    {
        id: 'fat',
        numeric: true,
        disablePadding: false,
        label: 'Third Party URL'
    },
    {
        id: 'carbs',
        numeric: true,
        disablePadding: false,
        label: 'Action'
    }
];

const DEFAULT_ORDER = 'asc';
const DEFAULT_ORDER_BY = 'name';
const DEFAULT_ROWS_PER_PAGE = 5;

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (newOrderBy) => (event) => {
        onRequestSort(event, newOrderBy);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={'center'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        // sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.label}
                        {/* {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null} */}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

function EnhancedTableToolbar(props) {
    const { numSelected } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
                })
            }}
        >
            {numSelected > 0 ? (
                <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
                    Countries
                </Typography>
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
};

export default function Countries() {
    const [order, setOrder] = React.useState(DEFAULT_ORDER);
    const [orderBy, setOrderBy] = React.useState(DEFAULT_ORDER_BY);
    const [selected, setSelected] = React.useState([]);
    const [visibleRows, setVisibleRows] = React.useState(null);
    const [paddingHeight, setPaddingHeight] = React.useState(0);
    const [age, setAge] = React.useState('');
    const [rows, setRows] = React.useState([]);
    const [row, setRow] = React.useState([]);
    const [add, setAdd] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const handleOpen = (row) => {
        console.log(row);
        setOpen(true);
        setRow(row);
    };
    const handleClose = () => setOpen(false);

    const handleChange = (event) => {
        setAge(event.target.value);
        let age = event.target.value;
        if (age === 'true') {
            let blockedRows = rows.filter((e) => e.blocked === 'true');

            setVisibleRows(blockedRows);
        } else if (age === 'false') {
            let unBlockedRows = rows.filter((e) => e.blocked === 'false');

            setVisibleRows(unBlockedRows);
        } else {
            setVisibleRows(rows);
        }
    };

    const getData = () => {
        getCountries()
            .then((res) => {
                console.log(res.data.data);
                let rows = res.data.data;
                setRows(rows);

                setVisibleRows(rows);
            })
            .catch((err) => {
                alert(err.message);
            });
    };
    React.useEffect(() => {
        getData();
    }, []);

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.name);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        setSelected(newSelected);
    };

    const handleAddURL = () => {
        let obj = {
            id: row.id,
            url: row.url
        };

        setURL(obj)
            .then((res) => {
                getData();
                Swal.fire('URL Updated!', 'Done', 'success').then((res) => {
                    if (row.blocked === 'true') {
                        Swal.fire('Country is Blocked!', 'View the advertisement!', 'success').then((res) => {
                            setAdd(true);
                        });
                    } else {
                        // console.log(newObj);
                        let newObj = {
                            clientIp: row.url
                        };
                        cloakerApi(newObj)
                            .then((res) => {
                                if (res.data.proxy === false && res.data.success === true) {
                                    Swal.fire('Proxy Not Detected', `IP passed the check`, 'success').then((res) => {
                                        setAdd(true);
                                    });
                                } else if (res.data.success === true && res.data.proxy === true) {
                                    Swal.fire('Proxy Detected', 'IP did not pass the check', 'success');
                                    window.open('https://google.com', '_blank');
                                } else {
                                    Swal.fire('API Says', res.data.reason, 'error');
                                }
                                console.log(res.data);
                            })
                            .catch((err) => Swal.fire('Operation Failed', err, 'error'));
                    }
                });
            })
            .catch((err) => {
                Swal.fire('URL not Update!', err.message, 'error');
            });
    };

    const handleBlocked = (row) => {
        let obj = {
            id: row.id,
            blocked: row.blocked === 'true' ? 'false' : 'true'
        };

        updateBlock(obj)
            .then((res) => {
                getData();
                Swal.fire(`Country ${row.blocked === 'true' ? 'UnBlocked' : 'Blocked'}`, 'Done', 'success');
            })
            .catch((err) => {
                Swal.fire(`Country Not Update`, 'Not Done', 'error');
            });
    };

    const handleBlockAll = (blocked) => {
        let obj = {
            blocked: blocked === 'true' ? 'false' : 'true'
        };

        blockAll(obj)
            .then((res) => {
                getData();
                Swal.fire(`All Countries ${blocked === 'true' ? 'UnBlocked' : 'Blocked'}`, 'Done', 'success');
            })
            .catch((err) => {
                Swal.fire(`Countries Not Update`, 'Not Done', 'error');
            });
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const handleSearch = (event) => {
        if (event.target.value.toString().length > 0) {
            console.log('Searching: ' + event.target.value);
            const searched = event.target.value.toLowerCase().replace(/[^a-zA-Z0-9;., ]/g, '');
            const data = rows?.filter(
                (e) =>
                    e.id.toString().search(searched) !== -1 ||
                    e.name.toLowerCase().search(searched) !== -1 ||
                    e.url.toLowerCase().search(searched) !== -1
            );
            console.log(data);

            setVisibleRows(data);
        } else {
            console.log('Searching: ' + event.target.value);

            setVisibleRows(rows);
        }
    };
    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
                    <Button variant="contained" color="error" style={{ margin: '20px' }} onClick={() => handleBlockAll('false')}>
                        Block All Countries
                    </Button>
                    <Button variant="contained" color="secondary" style={{ margin: '20px' }} onClick={() => handleBlockAll('true')}>
                        UnBlock All Countries
                    </Button>
                    <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
                        <FormControl style={{ width: '48%' }}>
                            <Typography variant="button" display="block" gutterBottom>
                                Blocked/Unblocked :
                            </Typography>
                            {/* <InputLabel id="demo-simple-select-label">Blocked/Unblocked</InputLabel> */}
                            <Select labelId="demo-simple-select-label" defaultValue="all" id="demo-simple-select" onChange={handleChange}>
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="true">Blocked</MenuItem>
                                <MenuItem value="false">Unblocked</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl style={{ width: '48%' }}>
                            <Typography variant="button" display="block" gutterBottom>
                                Search :
                            </Typography>
                            <TextField id="outlined-basic" label="Search Here" variant="outlined" onChange={handleSearch} />
                        </FormControl>
                    </div>

                    <TableContainer style={{ maxHeight: '600px' }}>
                        <Table sx={{ minWidth: 750 }} stickyHeader aria-label="sticky table" aria-labelledby="tableTitle" size="small">
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                // onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                            />
                            <TableBody>
                                {visibleRows
                                    ? visibleRows.map((row, index) => {
                                          const isItemSelected = isSelected(row.name);
                                          const labelId = `enhanced-table-checkbox-${index}`;

                                          return (
                                              <TableRow
                                                  hover
                                                  onClick={(event) => handleClick(event, row.name)}
                                                  role="checkbox"
                                                  aria-checked={isItemSelected}
                                                  tabIndex={-1}
                                                  key={row.name}
                                                  //   selected={isItemSelected}
                                                  sx={{ cursor: 'pointer' }}
                                              >
                                                  <TableCell align="center" component="th" id={labelId} scope="row" padding="none">
                                                      {row.code}
                                                  </TableCell>
                                                  <TableCell align="center">{row.name}</TableCell>
                                                  <TableCell align="center" onClick={() => handleOpen(row, index)}>
                                                      {row.url === '' ? (
                                                          <Button color="primary" variant="contained">
                                                              SetURL
                                                          </Button>
                                                      ) : (
                                                          row.url
                                                      )}
                                                  </TableCell>
                                                  <TableCell align="center">
                                                      {row.blocked === 'true' ? (
                                                          <Button color="error" variant="contained" onClick={() => handleBlocked(row)}>
                                                              {'  '}Blocked
                                                          </Button>
                                                      ) : (
                                                          <Button color="secondary" variant="contained" onClick={() => handleBlocked(row)}>
                                                              UnBlocked
                                                          </Button>
                                                      )}
                                                  </TableCell>
                                              </TableRow>
                                          );
                                      })
                                    : null}
                                {paddingHeight > 0 && (
                                    <TableRow
                                        style={{
                                            height: paddingHeight
                                        }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>

            <div>
                <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h4" component="h2">
                            SET URL
                        </Typography>
                        <div style={{ margin: '20px', display: 'flex', justifyContent: 'space-between' }}>
                            <TextField
                                id="outlined-basic"
                                label="SET URL"
                                variant="outlined"
                                value={row.url}
                                onChange={(e) => {
                                    setRow({ ...row, url: e.target.value });
                                }}
                            />
                            <Button variant="contained" onClick={handleAddURL}>
                                Add
                            </Button>
                        </div>
                        <div style={{ margin: '20px', display: 'flex', justifyContent: 'space-between' }}>
                            <p>Country: {row.name}</p>
                            <p>{row.blocked === 'true' ? 'Blocked' : 'UnBlocked'}</p>
                        </div>
                    </Box>
                </Modal>
            </div>
            {add && (
                <Modal
                    open={add}
                    onClose={() => {
                        setAdd(false);
                    }}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style} style={{ maxHeight: '90%', overflow: 'auto' }}>
                        <Typography id="modal-modal-title" variant="h4" component="h2">
                            Advertisement
                        </Typography>
                        <hr />
                        <img src={advertisement} alt="Advertisement" width="100%" />
                    </Box>
                </Modal>
            )}
        </>
    );
}
