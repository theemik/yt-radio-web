import React from "react";
import { NavLink } from "react-router-dom";
import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
    return (
        <nav>
            <div className={classes.history}>
                <NavLink
                    exact
                    to="/history"
                    className={classes.text}
                    activeClassName={classes["active-text"]}
                >
                    History
                </NavLink>
                <NavLink
                    exact
                    to="/history"
                    className={`${classes.icon} ${classes["history-icon"]}`}
                    activeClassName={`${classes.icon} ${classes["history-icon"]} ${classes["active-icon"]}`}
                />
            </div>
            <div className={classes.logo}>
                <NavLink
                    exact
                    className={classes["logo-link"]}
                    activeClassName={classes["active-logo-link"]}
                    to="/"
                >
                    YtRadio
                </NavLink>
            </div>
            <div className={classes["top-videos"]}>
                <NavLink exact to="/top" className={classes.text} activeClassName={classes["active-text"]}>
                    Top Videos
                </NavLink>
                <NavLink
                    exact
                    to="/top"
                    className={`${classes.icon} ${classes["top-videos-icon"]}`}
                    activeClassName={`${classes.icon} ${classes["top-videos-icon"]} ${classes["active-icon"]}`}
                />
            </div>
        </nav>
    );
};

export default MainNavigation;
