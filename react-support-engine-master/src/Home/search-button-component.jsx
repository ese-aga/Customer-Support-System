import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    button: {
        backgroundColor: (props) => props.iconProp ? 'transparent' : props.rsa ? '#DC1860' : '#1ef1c6',
        borderRadius: '1px 1px 1px 10px',
        height: (props) => props.height ? '40px' : '33px',
        color: (props) => props.iconProp ? '#DC1860' : props.rsa ? 'white' : '#000',
        border: (props) => props.iconProp ? '1px solid #DC1860' : props.rsa ? '' : '',
        textTransform: 'initial',
        fontFamily: 'LynkcoTypeMedium',
        '&:hover': {
            backgroundColor: (props) => props.iconProp ? 'transparent' : props.rsa ? '#893257' : '#088a70',
            color: (props) => props.iconProp ? '#DC1860' : '#000',
        },
        whiteSpace: 'nowrap',
        width: '7vw',
        fontSize: '0.9rem'
    }
}));

const SearchButton = (props) => {
    const classes = useStyles(props);
    const { handleSearch, placeholder, icon, iconProp = false, height, rsa } = props;

    return (
        <Button onClick={handleSearch} className={classes.button} variant="contained" placeholder={placeholder} icon={icon}>
            {placeholder}
            {icon}
        </Button>
    );
}

export default SearchButton;