import React, { useState } from "react";
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
import { visuallyHidden } from '@mui/utils';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import Modal from "@mui/material/Modal";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

let customer_id = '';

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
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
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

const DEFAULT_ORDER = 'asc';
const DEFAULT_ORDER_BY = 'calories';
const DEFAULT_ROWS_PER_PAGE = 15;

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells } =
    props;
  const createSortHandler = (newOrderBy) => (event) => {
    onRequestSort(event, newOrderBy);
  };

  return (
    <TableHead sx={{ backgroundColor: '#212121', border: '2px solid #212121', }}>
      <TableRow sx={{ backgroundColor: '#212121', border: '2px solid #212121', }}>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
            sx={{ color: 'white' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ color: 'white' }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span"
                  sx={visuallyHidden}
                >
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
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
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, heading, handleSliderOpen, handleClickDelete, handleClickEdit } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%', color: 'white' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%', color: 'white' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {heading}
        </Typography>
      )}
      {heading === 'List of Cases' || heading === 'List of Products' ? (<>
        {numSelected > 0 ? (

          <>
            <Tooltip title="Edit"
              onClick={handleClickEdit} sx={{ color: 'white' }}
            >
              <IconButton>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </>

        ) : (<></>)}
      </>) : (<>
        {numSelected > 0 ? (
          <>
            <Tooltip title="Edit"
              onClick={handleClickEdit} sx={{ color: 'white' }}
            >
              <IconButton>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" onClick={handleClickDelete} sx={{ color: 'white' }}>
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <Tooltip title="Create"
            onClick={handleSliderOpen}
            sx={{ color: 'white' }}
          >
            <IconButton>
              <AddIcon />
            </IconButton>
          </Tooltip>
        )}
      </>)}

    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const UseStyles = makeStyles((theme) => ({
  dividerStyle: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginLeft: -theme.spacing(1),
    marginRight: -theme.spacing(1),
    marginTop: theme.spacing(6),
    height: '2px',
    marginBottom: '10px'
  },
  gridContainerStyle: {
    marginLeft: '11px',
  },
  drawer: {
    width: '100%',
    flexShrink: 0,
    marginTop: '100px',
    alignItems: 'center',
    position: 'absolute',
    height: '460px',
    display: 'flex',
    justifyContent: 'center'
  },
  gridContainerStyle1: {
    width: '100%',
  },
  cardStyle: {
    backgroundColor: 'rgb(19 19 19 / 97%)',
    height: '860px',
    borderRadius: '1px',
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
    color: 'white',
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '300px',
      border: '2px solid #2c2c2c',
      color: 'white',
    },
    '& .MuiButtonBase-root': {
      margin: theme.spacing(2),
    },
    '& .MuiFilledInput-input': {
      color: 'white'
    },

    '& .MuiFormLabel-root': {
      fontSize: '12px',
      backgroundColor: 'rgb(19 19 19 / 1%)',
      display: '',
      color: '#1EF1C6',
    },
    '& .MuiFormLabel-root.Mui-focused': {
      color: '#1EF1C6'
    },
    '& .MuiFormLabel-root.Mui-disabled': {
      color: 'black'
    },
    '& .MuiInputBase-input.Mui-disabled': {
      opacity: 1,
      color: (props) => props.isNumberOfVins ? props.value > 10 ? '#1EF1C6' : '#DC1860' : 'black',
      fontSize: '14px',
    },

    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgb(19 19 19 / 1%)',
      color: 'white',
      '& fieldset': {
        borderColor: (props) => props.priceBucketActiveTab ? "#1EF1C6" : 'rgba(255, 255, 255, 0.001)',
        borderWidth: (props) => props.priceBucketActiveTab ? '0.5px' : 'thin',
      },
      '&:hover fieldset': {
        borderColor: '#1EF1C6',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1EF1C6',
      },
    },
    "& .MuiOutlinedInput-input": {
      color: "white",
      fontSize: '15px',

      textAlign: (props) => props.isPriceBucketField ? 'end' : 'start',
    },
    '& .MuiOutlinedInput-root.Mui-disabled': {
      '& fieldset': {
        borderColor: (props) => props.isNumberOfVins ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.001)',
      },
      '&:hover fieldset': {
        borderColor: (props) => props.isNumberOfVins ? 'rgba(0, 0, 0, 0.05)' : '#1EF1C6',
      },
      '&.Mui-focused fieldset': {
        borderColor: (props) => props.isNumberOfVins ? 'rgba(0, 0, 0, 0.05)' : '#1EF1C6',
      },
    }
  },
}));

export default function AdminTable(props) {
  const { headCells, rows, heading, status } = props;

  const classes = UseStyles(props);

  const [order, setOrder] = React.useState(DEFAULT_ORDER);
  const [orderBy, setOrderBy] = React.useState(DEFAULT_ORDER_BY);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [visibleRows, setVisibleRows] = React.useState(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE);
  const [paddingHeight, setPaddingHeight] = React.useState(0);

  const [open, setOpen] = React.useState(false);

  const [sliderUser, setSliderUser] = React.useState({
    agent_id: "",
    name: "",
    email: "",
    passwords: "",
    status: "",
    availability: "",
    roles: "",
    editMode: false
  });

  const [closeCase, setCloseCase] = React.useState({
    case_id: "",
    customer_id: "",
    description: "",
    product_id: "",
    status: "",
  });

  const [createCase, setCreateCase] = React.useState({
    name: "",
    product_id: ""
  });

  const [selectedRow, setSelectedRow] = React.useState({});
  const [selectedRowCases, setSelectedRowCases] = React.useState({});
  const [selectedRowProduct, setSelectedRowProduct] = React.useState({});
  const [description, setDescription] = useState('');

  React.useEffect(() => {

    let rowsOnMount = stableSort(
      rows,
      getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY),
    );

    rowsOnMount = rowsOnMount.slice(
      0 * DEFAULT_ROWS_PER_PAGE,
      0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE,
    );

    setVisibleRows(rowsOnMount);
  }, [rows]);

  const handleRequestSort = React.useCallback(
    (event, newOrderBy) => {
      const isAsc = orderBy === newOrderBy && order === 'asc';
      const toggledOrder = isAsc ? 'desc' : 'asc';
      setOrder(toggledOrder);
      setOrderBy(newOrderBy);

      const sortedRows = stableSort(rows, getComparator(toggledOrder, newOrderBy));
      const updatedRows = sortedRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      );

      setVisibleRows(updatedRows);
    },
    [order, orderBy, page, rowsPerPage],
  );

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name, row) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
    setSelectedRow({
      agent_id: row.agent_id,
      name: row.name,
      email: row.email,
      status: row.status,
      availability: row.availability,
      roles: row.roles,
      editMode: true
    });

    setSelectedRowCases({
      case_id: row.case_id,
      customer_id: row.customer_id,
      description: row.description,
      product_id: row.product_id,
      status: row.status,
    });

    setSelectedRowProduct({
      name: row.name,
      product_id: row.product_id,
      editMode: true
    });
  };

  const handleChangePage = React.useCallback(
    (event, newPage) => {
      setPage(newPage);

      const sortedRows = stableSort(rows, getComparator(order, orderBy));
      const updatedRows = sortedRows.slice(
        newPage * rowsPerPage,
        newPage * rowsPerPage + rowsPerPage,
      );

      setVisibleRows(updatedRows);

      // Avoid a layout jump when reaching the last page with empty rows.
      const numEmptyRows =
        newPage > 0 ? Math.max(0, (1 + newPage) * rowsPerPage - rows.length) : 0;

      const newPaddingHeight = (dense ? 33 : 53) * numEmptyRows;
      setPaddingHeight(newPaddingHeight);
    },
    [order, orderBy, dense, rowsPerPage],
  );

  const handleChangeRowsPerPage = React.useCallback(
    (event) => {
      const updatedRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(updatedRowsPerPage);

      setPage(0);

      const sortedRows = stableSort(rows, getComparator(order, orderBy));
      const updatedRows = sortedRows.slice(
        0 * updatedRowsPerPage,
        0 * updatedRowsPerPage + updatedRowsPerPage,
      );

      setVisibleRows(updatedRows);

      // There is no layout jump to handle on the first page.
      setPaddingHeight(0);
    },
    [order, orderBy],
  );

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleClickAdd = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    if (heading === 'List of Products') {
      handleCreateCase();
    }
    if (heading === 'List of Agents') {
      saveSliderUser();
    }
    if (heading === 'List of Cases') {
      updateCase();
    }
  };

  const handleSliderOpen = () => {
    setOpen(true);
    setSliderUser({
      ...sliderUser,
      agent_id: "",
      name: "",
      email: "",
      passwords: "",
      status: "",
      availability: "",
      roles: "",
      editMode: false
    });
  };

  const handleClickDelete = () => {
    DeleteSelectedUser(selectedRow.email);
  };
  const DeleteSelectedUser = async () => {
    const url = `http://localhost:8000/agent/${selectedRow.agent_id}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: window.sessionStorage.getItem("token"),
    };

    try {
      let res = await axios.delete(
        url, { headers })
      if (res.status === 204) {
        setOpen(false);
      }
    }
    catch (error) {
      console.log(error)
    }
  };

  const handleClickEdit = () => {
    if (selected.length > 0) {
      setOpen(true);
      setSliderUser({
        ...sliderUser, agent_id: selectedRow.agent_id, name: selectedRow.name,
        email: selectedRow.email, status: selectedRow.status,
        availability: selectedRow.availability, roles: selectedRow.roles,
        editMode: true
      });

      setCloseCase({
        ...closeCase, case_id: selectedRowCases.case_id, customer_id: selectedRowCases.customer_id,
        description: selectedRowCases.description, product_id: selectedRowCases.product_id,
        status: selectedRowCases.status,
        editMode: true
      });

      setCreateCase({
        ...createCase, name: selectedRowProduct.name,
        product_id: selectedRowProduct.product_id,
        editMode: true
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSliderUser({ ...sliderUser, [name]: value });
    setCloseCase({ ...closeCase, [name]: value })
  };

  const saveAgent = async () => {

    const url = `http://localhost:8000/agent/register`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: window.sessionStorage.getItem("token"),
    };

    const data = {
      "name": sliderUser.name,
      "email": sliderUser.email,
      "passwords": sliderUser.passwords,
    }

    try {
      let res = await axios.post(
        url, data, { headers })
      if (res.status === 200) {
        setOpen(false);
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  const updateAgent = async () => {
    const url = `http://localhost:8000/agent/${selectedRow.agent_id}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: window.sessionStorage.getItem("token"),
    };

    const data = {
      "name": sliderUser.name,
      "email": sliderUser.email,
    }

    try {
      let res = await axios.put(
        url, data, { headers })
      if (res.status === 200) {
        setOpen(false);
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  const updateCase = async () => {
    const url = `http://localhost:8000/case/complete/${selectedRowCases.case_id}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: window.sessionStorage.getItem("token"),
    };

    try {
      let res = await axios.post(url)
      if (res.status === 200) {
        setOpen(false);
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  const handleCreateCase = async () => {
    customer_id = window.sessionStorage.getItem("customerID");
    let product_id = selectedRowProduct.product_id;
    try {
      let res = await axios.post(
        'http://localhost:8000/case',
        { product_id, customer_id, description },
      )
      if (res.status === 201) {
        setOpen(false);
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  const saveSliderUser = () => {
    sliderUser.editMode ?
      updateAgent()
      :
      saveAgent()
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Modal
        className={classes.drawer}
        variant="persistent"
        anchor="right"
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClose={handleClose}
        BackdropProps={{ style: { backgroundColor: 'rgba(0, 0, 0, 0.8)' } }}
      >
        <div style={{ border: '1px solid #131313', backgroundColor: '#131313' }}>
          <form className={classes.root}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {status === 'agent' ? (<>
              {sliderUser.editMode ? (<>
                <TextField
                  label="Name"
                  variant="outlined"
                  type="product_id"
                  required
                  value={sliderUser.name}
                  defaultValue
                  name="name"
                  onChange={handleChange}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  type="description"
                  required
                  name="email"
                  value={sliderUser.email}
                  onChange={handleChange}
                />
              </>) : (<>
                <TextField
                  label="Name"
                  variant="outlined"
                  type="product_id"
                  required
                  value={sliderUser.name}
                  defaultValue
                  name="name"
                  onChange={handleChange}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  type="description"
                  required
                  name="email"
                  value={sliderUser.email}
                  onChange={handleChange}
                />
                <TextField
                  label="Password"
                  variant="outlined"
                  type="description"
                  required
                  name="passwords"
                  value={sliderUser.passwords}
                  onChange={handleChange}
                />
              </>)}

            </>) : status === 'cases' ? (<>
              <TextField
                label="Status"
                variant="outlined"
                type="product_id"
                required
                name="status"
                value={sliderUser.status}
                onChange={handleChange}
              />

            </>) : status === 'product' ? (<>
              <TextField
                label="Product ID"
                variant="outlined"
                type="product_id"
                required
                name="product_id"
                value={createCase.product_id}
                onChange={handleChange}
              />
              <TextField
                label="Description"
                variant="outlined"
                type="description"
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </>) : (<></>)}

            <div>
              <Button variant="contained" onClick={() => handleClose('admin')}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" style={{ backgroundColor: '#1EF1C6' }} >
                Create Case
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Paper sx={{ width: '100%', mb: 2, backgroundColor: '#212121' }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          heading={heading}
          handleClickAdd={handleClickAdd}
          handleSliderOpen={handleSliderOpen}
          handleClickDelete={handleClickDelete}
          handleClickEdit={handleClickEdit}
        />
        <TableContainer sx={{
          height: '230px', position: 'relative', overflow: 'auto', marginTop: '-5px', padding: '5px',
          "&::-webkit-scrollbar": {
            height: "15px",
            width: "5px",
            opacity: "0.9",
            backgroundColor: '#212121'
          },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: "100px",
            backgroundColor: 'white',
            border: 'none'
          },
        }}>
          <Table
            sx={{ minWidth: 750, backgroundColor: '#131313', color: 'white' }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={headCells}
              status={status}
            />
            <TableBody>
              {visibleRows
                ? visibleRows?.map((row, index) => {
                  const isItemSelected = isSelected(status === 'cases' ? row.case_id : row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => {
                        status === 'cases' ? handleClick(event, row.case_id, row) : handleClick(event, row.name, row)
                      }}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={status === 'cases' ? row.case_id : row.name}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer', backgroundColor: '#212121' }}
                    >
                      <TableCell padding="checkbox" >
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                          sx={{ color: 'white' }}
                        />
                      </TableCell>
                      {status === 'agent' ? (<>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          sx={{ color: 'white' }}
                        >
                          {row.name}
                        </TableCell>
                        <TableCell sx={{ color: 'white' }} align="left">{row.email}</TableCell>
                        <TableCell sx={{ color: 'white' }} align="right">{row.roles}</TableCell>
                        <TableCell sx={{ color: 'white' }} align="right">{row.availability}</TableCell>
                        <TableCell sx={{ color: 'white' }} align="right">{row.status}</TableCell>
                      </>) :
                        status === 'cases' ? (<>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            sx={{ color: 'white' }}
                          >
                            {row.case_id}
                          </TableCell>
                          <TableCell sx={{ color: 'white' }} align="left">{row.customer_id}</TableCell>
                          <TableCell sx={{ color: 'white' }} align="right">{row.description}</TableCell>
                          <TableCell sx={{ color: 'white' }} align="right">{row.product_id}</TableCell>
                          <TableCell sx={{ color: 'white' }} align="right">{row.status}</TableCell>
                        </>) : status === 'customer' ? (<>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            sx={{ color: 'white' }}
                          >
                            {row.name}
                          </TableCell>
                          <TableCell sx={{ color: 'white' }} align="left">{row.email}</TableCell>
                          <TableCell sx={{ color: 'white' }} align="right">{row.address}</TableCell>
                          <TableCell sx={{ color: 'white' }} align="right">{row.roles}</TableCell>
                          <TableCell sx={{ color: 'white' }} align="right">{row.customer_id}</TableCell>
                        </>) : status === 'product' ? (<>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            sx={{ color: 'white' }}
                          >
                            {row.name}
                          </TableCell>
                          <TableCell sx={{ color: 'white' }} align="left">{row.product_id}</TableCell>
                        </>) : <></>}
                    </TableRow>
                  );
                })
                : null}
              {paddingHeight > 0 && (
                <TableRow
                  style={{
                    height: paddingHeight,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[15, 20, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            color: 'white',
            '& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon': {
              backgroundColor: 'rgb(19 19 19 / 1%)',
              display: '',
              color: 'white',
              marginTop: '-10px'
            },
            '& .css-194a1fa-MuiSelect-select-MuiInputBase-input.css-194a1fa-MuiSelect-select-MuiInputBase-input.css-194a1fa-MuiSelect-select-MuiInputBase-input': {
              backgroundColor: 'rgb(19 19 19 / 1%)',
              display: '',
              color: 'white',
              marginTop: '-15px'
            },
          }}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
        sx={{ color: 'white' }}
      />
    </Box>
  );
}