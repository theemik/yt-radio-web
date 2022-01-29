import React from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import classes from "./VideoPreview.module.css";

const VideoPreview = (props) => {
    if (!props.video) {
        return (
            <div className={classes["video-preview"]}>
                <div
                    className={`${classes["image-container"]} ${classes["image-container-loading"]}`}
                ></div>
                <h3>&nbsp;</h3>
            </div>
        );
    } else {
        return (
            <div className={classes["video-preview"]}>
                <h3 className={classes.heading}>
                    {props.heading ? props.heading : null}
                </h3>
                <div className="break"></div>
                <div className={classes["image-container"]}>
                    <a href={props.video.url} target="_blank" rel="noreferrer">
                        <TransitionGroup>
                            <CSSTransition
                                key={props.video.thumbnail_url}
                                timeout={1000}
                                classNames={{
                                    enter: classes["slide-enter"],
                                    enterActive: classes["slide-enter-active"],
                                    exit: classes["slide-exit"],
                                    exitActive: classes["slide-exit-active"],
                                }}
                            >
                                <img
                                    src={props.video.thumbnail_url}
                                    alt={props.video.title}
                                ></img>
                            </CSSTransition>
                        </TransitionGroup>
                    </a>
                </div>
                <div className="break"></div>
                <h3 className={classes.title} title={props.video.title}>
                    {props.video.title}
                </h3>
            </div>
        );
    }
};

export default VideoPreview;
