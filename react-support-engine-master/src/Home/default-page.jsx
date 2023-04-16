import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import bgImage from '../asset/img/BackgroundImages/newBackground.png'
import backgroundImage from "../asset/img/BackgroundImages/BackgroundImage-dark.png";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    panel: {
        backgroundImage: (props) => props.backgroundtype ? "url(" + backgroundImage + ")" : "url(" + bgImage + ")",

        position: "fixed",
        height: "100%",
        width: "100%",
        display: "block",
        top: "0",
        left: "0",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
    },
}));

const DefaultPage = (props) => {
    const { backgroundtype = 'false' } = props
    const classes = useStyles(props);
    return (
        <div>
            {bgImage !== undefined ? (
                <div
                    backgroundtype={backgroundtype}
                    className={classes.panel}
                />
            ) : null}
        </div>
    );
}

export default DefaultPage;