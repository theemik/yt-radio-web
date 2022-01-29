import { React, useRef, useEffect } from "react";
import Video from "../components/Video";
import classes from "./VideoList.module.css";

const VideoList = (props) => {
    let listRef = useRef(null);

    useEffect(() => {
        if (props.setRef) {
            props.setRef(listRef.current);
        }
    })

    let nFormatter = (num, digits) => {
        const lookup = [
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "K" },
            { value: 1e6, symbol: "M" },
            { value: 1e9, symbol: "B" },
            { value: 1e12, symbol: "T" },
            { value: 1e15, symbol: "P" },
            { value: 1e18, symbol: "E" },
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

        let item = lookup
            .slice()
            .reverse()
            .find((item) => {
                return num >= item.value;
            });
        return item
            ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
            : "0";
    };
    
    return (
        <div className={classes.list}>
            <ul ref={listRef}>
                {Object.values(props.videos).map((video, index) => (
                    <Video
                        key={video.id}
                        id={video.id}
                        image={video.thumbnail_url ? video.thumbnail_url : ""}
                        title={video.title ? video.title : ""}
                        url={video.url ? video.url : ""}
                        index={index}
                        viewCount={
                            video.view_count
                                ? nFormatter(video.view_count)
                                : ""
                        }
                        onClick={props.onClick ? props.onClick : ""}
                    />
                ))}
            </ul>
        </div>
    );
};

export default VideoList;
