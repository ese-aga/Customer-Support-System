import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import WorkOrderDetail from './Table';
import { Row, Col } from "reactstrap";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
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

const SignUpFormCustomer = () => {
  const classes = useStyles();
  // create state variables for each input
  const [email, setEmail] = useState('');
  const [passwords, setPassword] = useState('');
  const [openTable, setOpenTable] = useState(false)

  let navigate = useNavigate();

  const handleSubmit = async (email, passwords) => {
    try {
      let res = await axios.post(
        'http://localhost:8000/customer/login',
        { email, passwords },
      )
      if (res.status === 200) {
        window.sessionStorage.setItem("token", res.data.token)
        window.sessionStorage.setItem("customerID", res.data.customer_id)

        navigate("/SupportEngine/Customerpage")
      }
    }
    catch (error) {
      console.log(error)
    }
  };

  const handleClose = () => {
    setOpenTable(true);
  }

  return (
    <div>
      {openTable ? (<div>
        <Row>
          <Col lg="6" md="6" >
            <WorkOrderDetail />
          </Col>
          <Col lg="6" md="6" >
            <WorkOrderDetail />
          </Col>

        </Row>

      </div>) : (<>
        <form className={classes.root}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(email, passwords);
          }}
        >
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            required
            value={passwords}
            onChange={e => setPassword(e.target.value)}
          />
          <div>
            <Button variant="contained" onClick={() => handleClose('admin')}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Signin
            </Button>
          </div>
        </form>
      </>)}
    </div>
  );
};

export default SignUpFormCustomer;