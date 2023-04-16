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
}));



const AdminPage = (props) => {
    // const [rows, setRows] = React.useState([]);
    const classes = UseStyles(props);
    const [rows, setRows] = useState([]);
    const [rowsCases, setRowsCases] = useState([]);
    const [rowsCustomer, setRowsCustomer] = useState([]);

    const [rowsProduct, setRowsProduct] = useState([]);

    const [homePage, setHomePage] = useState(false);


    const headCellsCases = [
        {
            id: 'case_id',
            numeric: false,
            disablePadding: true,
            label: 'Case ID',
        },
        {
            id: 'customer_id',
            numeric: true,
            disablePadding: false,
            label: 'Customer ID',
        },
        {
            id: 'description',
            numeric: true,
            disablePadding: false,
            label: 'Description',
        },
        {
            id: 'product_id',
            numeric: true,
            disablePadding: false,
            label: 'Product ID',
        },
        {
            id: 'status',
            numeric: true,
            disablePadding: false,
            label: 'Status',
        },
    ];

    const headCellsAgents = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Name',
        },
        {
            id: 'email',
            numeric: false,
            disablePadding: false,
            label: 'Email',
        },
        {
            id: 'roles',
            numeric: true,
            disablePadding: false,
            label: 'Role',
        },
        {
            id: 'availability',
            numeric: true,
            disablePadding: false,
            label: 'Availability',
        },
        {
            id: 'status',
            numeric: true,
            disablePadding: false,
            label: 'Status',
        },
    ];

    const headCellsCustomers = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Name',
        },
        {
            id: 'email',
            numeric: false,
            disablePadding: false,
            label: 'Email',
        },
        {
            id: 'address',
            numeric: true,
            disablePadding: false,
            label: 'Address',
        },
        {
            id: 'roles',
            numeric: true,
            disablePadding: false,
            label: 'Role',
        },
        {
            id: 'customer_id',
            numeric: true,
            disablePadding: false,
            label: 'Customer ID',
        },
    ];

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
        const url = `http://localhost:8000/agents`;
        const headers = {
            "Content-Type": "application/json",
            Authorization: window.sessionStorage.getItem("token"),
        };
        axios.get(url, { headers }).then((response) => {
            if (response.status === 200) {
                setRows(response.data);
            }
        });
        if (!rows) return null;

    }, []);

    useEffect(() => {
        const url = `http://localhost:8000/case`;
        const headers = {
            "Content-Type": "application/json",
            Authorization: window.sessionStorage.getItem("token"),
        };
        axios.get(url, { headers }).then((response) => {
            if (response.status === 200) {
                setRowsCases(response.data);
            }
        });
        if (!rows) return null;

    }, []);

    useEffect(() => {
        const url = `http://localhost:8000/AdminGetCustomer`;
        const headers = {
            "Content-Type": "application/json",
            Authorization: window.sessionStorage.getItem("token"),
        };
        axios.get(url, { headers }).then((response) => {
            if (response.status === 200) {
                setRowsCustomer(response.data);
            }
        });
        if (!rows) return null;

    }, []);

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
        if (!rows) return null;

    }, []);

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
                                    <Col lg="6" md="6" >
                                        <AdminTable headCells={headCellsAgents} rows={rows} heading={'List of Agents'} status={'agent'} />
                                    </Col>
                                    <Col lg="6" md="6" >
                                        <AdminTable headCells={headCellsCases} rows={rowsCases} heading={'List of Cases'} status={'cases'} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg="6" md="6" >
                                        <AdminTable headCells={headCellsCustomers} rows={rowsCustomer} heading={'List of Customers'} status={'customer'} />
                                    </Col>
                                    <Col lg="6" md="6" >
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

export default AdminPage;