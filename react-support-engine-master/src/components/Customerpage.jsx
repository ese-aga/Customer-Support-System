import React, { useEffect, useState } from 'react';
import { Card, Row, Col, CardBody } from "reactstrap";
import AdminTable from './Table';
import DefaultPage from '../Home/default-page';
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import SearchButton from '../Home/search-button-component';
import ReportsMainPage from '../Home/HomePage';

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
        display: 'flex', justifyContent: 'center'
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

let customer_id = '';

const CustomerPage = (props) => {
    const classes = UseStyles(props);

    const [rowsProduct, setRowsProduct] = useState([]);
    const [homePage, setHomePage] = useState(false);

    const headCellsProduct = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Name',
        },
        {
            id: 'product_id',
            numeric: false,
            disablePadding: false,
            label: 'Product ID',
        },
    ];

    useEffect(() => {
        const url = `http://localhost:8000/product`;
        const headers = {
            "Content-Type": "application/json",
            Authorization: window.sessionStorage.getItem("token"),
        };
        axios.get(url, { headers }).then((response) => {
            if (response.status === 200) {
                setRowsProduct(response.data);
            }

        });
    }, []);

    customer_id = window.sessionStorage.getItem("customerID");

    const handleClick = () => {
        setHomePage(true);
    }

    return (
        <div style={{ backgroundColor: 'rgb(19 19 19 / 85%)', marginTop: '30px', marginLeft: '25px', marginRight: '25px', borderRadius: '1px', }}>
            <DefaultPage backgroundtype='true' />
            <SearchButton placeholder='Home Page' handleSearch={handleClick} />
            {homePage ? (<div style={{ marginTop: '-60px', marginLeft: '-30px', borderRadius: '1px', position: 'fixed', width: '100%' }}>
                <ReportsMainPage />
            </div>) : (<>
                <Row>
                    <Col lg="12" md="12" >
                        <Card className={classes.cardStyle} >
                            <CardBody>
                                <Row>
                                    <Col lg="12" md="12" >
                                        <AdminTable headCells={headCellsProduct} rows={rowsProduct} heading={'List of Products'} status={'product'} />
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>

                    </Col>
                </Row>
            </>)}
        </div>
    );
};

export default CustomerPage;