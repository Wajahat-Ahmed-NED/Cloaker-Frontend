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
import crypto from 'crypto';
import sha256 from 'crypto-js/sha256';

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
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            // direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {/* {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null} */}
                        </TableSortLabel>
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
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [visibleRows, setVisibleRows] = React.useState(null);
    const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE);
    const [paddingHeight, setPaddingHeight] = React.useState(0);
    const [age, setAge] = React.useState('');
    const [rows, setRows] = React.useState([]);
    const [row, setRow] = React.useState([]);
    // const [urlModal, setURLModal] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const handleOpen = (row) => {
        setOpen(true);
        setRow(row);
    };
    const handleClose = () => setOpen(false);

    const handleChange = (event) => {
        setAge(event.target.value);
        let age = event.target.value;
        if (age === 'true') {
            let blockedRows = rows.filter((e) => e.blocked === 'true');

            let rowsOnMount = stableSort(blockedRows, getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY));

            rowsOnMount = rowsOnMount.slice(0 * DEFAULT_ROWS_PER_PAGE, 0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE);

            setVisibleRows(rowsOnMount);
        } else if (age === 'false') {
            let unBlockedRows = rows.filter((e) => e.blocked === 'false');

            let rowsOnMount = stableSort(unBlockedRows, getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY));

            rowsOnMount = rowsOnMount.slice(0 * DEFAULT_ROWS_PER_PAGE, 0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE);

            setVisibleRows(rowsOnMount);
        } else {
            getData();
        }
    };

    const getData = () => {
        getCountries()
            .then((res) => {
                console.log(res.data.data);
                let rows = res.data.data;
                setRows(rows);
                let rowsOnMount = stableSort(rows, getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY));

                rowsOnMount = rowsOnMount.slice(0 * DEFAULT_ROWS_PER_PAGE, 0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE);

                setVisibleRows(rowsOnMount);
            })
            .catch((err) => {
                alert(err.message);
            });
    };
    React.useEffect(() => {
        getData();
    }, []);

    const handleRequestSort = React.useCallback(
        (event, newOrderBy) => {
            const isAsc = orderBy === newOrderBy && order === 'asc';
            const toggledOrder = isAsc ? 'desc' : 'asc';
            setOrder(toggledOrder);
            setOrderBy(newOrderBy);

            const sortedRows = stableSort(rows, getComparator(toggledOrder, newOrderBy));
            const updatedRows = sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

            setVisibleRows(updatedRows);
        },
        [order, orderBy, page, rowsPerPage]
    );

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

    const handleChangePage = React.useCallback(
        (event, newPage) => {
            setPage(newPage);

            const sortedRows = stableSort(rows, getComparator(order, orderBy));
            const updatedRows = sortedRows.slice(newPage * rowsPerPage, newPage * rowsPerPage + rowsPerPage);

            setVisibleRows(updatedRows);

            // Avoid a layout jump when reaching the last page with empty rows.
            const numEmptyRows = newPage > 0 ? Math.max(0, (1 + newPage) * rowsPerPage - rows.length) : 0;

            const newPaddingHeight = (dense ? 33 : 53) * numEmptyRows;
            setPaddingHeight(newPaddingHeight);
        },
        [order, orderBy, dense, rowsPerPage]
    );

    const handleChangeRowsPerPage = React.useCallback(
        (event) => {
            const updatedRowsPerPage = parseInt(event.target.value, 10);
            setRowsPerPage(updatedRowsPerPage);

            setPage(0);

            const sortedRows = stableSort(rows, getComparator(order, orderBy));
            const updatedRows = sortedRows.slice(0 * updatedRowsPerPage, 0 * updatedRowsPerPage + updatedRowsPerPage);

            setVisibleRows(updatedRows);

            // There is no layout jump to handle on the first page.
            setPaddingHeight(0);
        },
        [order, orderBy]
    );

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    // const checking = () => {
    //     const user = 'myuser';
    //     const clientIp = '192.168.0.1';
    //     const userKey = 'my-secret-key';

    //     const hash = crypto.createHash('sha256');
    //     hash.update(user + clientIp + userKey);
    //     const sig = hash.digest('binary');

    //     const sigBase64 = btoa(sig);
    //     const sigUrlEncoded = decodeURIComponent(sigBase64);
    //     console.log(sigUrlEncoded);
    // };

    const handleAddURL = () => {
        let obj = {
            id: row.id,
            url: row.url
        };
        const clientIp = row.url;
        const userId = 'U106';
        const serverIp = ' 192.168.43.37';
        const serverPort = '3000';
        const userKey = '51bcce7d781f86c0504ba207c8b9779830194767f7a3';

        const signature = hash(userId + clientIp + userKey);
        const signatureBase64 = btoa(signature);
        const signatureUrlEncoded = encodeURIComponent(signatureBase64);

        console.log(signatureUrlEncoded);
        let newObj = {
            clientIp,
            userId,
            serverIp,
            serverPort,
            key: signatureUrlEncoded
        };

        setURL(obj)
            .then((res) => {
                getData();
                Swal.fire('URL Updated!', 'Done', 'success').then((res) => {
                    if (row.blocked === 'true') {
                        Swal.fire('Country is Blocked!', 'View the advertisement!', 'success');
                    } else {
                        cloakerApi(newObj)
                            .then((res) => {
                                if (res.data.proxy === false) {
                                    Swal.fire('Proxy False', 'View the advertisement', 'success');
                                } else {
                                    Swal.fire('IP Success', 'Redirecting to new window', 'success');
                                }
                                console.log(res.data);
                            })
                            .catch((err) => Swal.fire('IP Success Failed', err, 'error'));
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
                Swal.fire(`All Countries ${row.blocked === 'true' ? 'UnBlocked' : 'Blocked'}`, 'Done', 'success');
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
            let rowsOnMount = stableSort(data, getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY));

            rowsOnMount = rowsOnMount.slice(0 * DEFAULT_ROWS_PER_PAGE, 0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE);

            setVisibleRows(rowsOnMount);
        } else {
            console.log('Searching: ' + event.target.value);
            let rowsOnMount = stableSort(rows, getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY));

            rowsOnMount = rowsOnMount.slice(0 * DEFAULT_ROWS_PER_PAGE, 0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE);

            setVisibleRows(rowsOnMount);
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

                    <TableContainer>
                        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
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
                                                  <TableCell align="center" onClick={() => handleOpen(row)}>
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
                                                  {/* <TableCell align="right">{row.protein}</TableCell> */}
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
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
                {/* <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" /> */}
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
        </>
    );
}
