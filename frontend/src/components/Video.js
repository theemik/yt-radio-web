import { React, useRef } from "react";
import classes from "./Video.module.css";

const Video = (props) => {
    let videoRef = useRef();

    return (
        <li
            ref={videoRef}
            id={props.id}
            className={classes["video-container"]}
            onClick={
                props.onClick
                    ? () => {
                          props.onClick(videoRef.current, props.index);
                      }
                    : ""
            }
        >
            <div className={classes.image}>
                <img src={props.image} alt="thumbnail" />
            </div>
            <div className={classes.info}>
                <div className={classes.title}>{props.title}</div>
                {props.viewCount ? (
                    <div className={classes.views}>
                        <span>Views: {props.viewCount}</span>
                    </div>
                ) : (
                    ""
                )}
            </div>
        </li>
    );
};

export default Video;
