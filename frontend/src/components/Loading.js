import React from 'react';
import classes from './Loading.module.css';


const Loading = () => {
    return (
        <div className={classes['loading-container']}>
            <span className={classes.loading}></span>
            <span className={classes.loading}></span>
            <span className={classes.loading}></span>
            <span className={classes.loading}></span>
        </div>
    )
}

export default Loading
