import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import Loading from "../components/Loading";
import VideoPreview from "../components/VideoPreview";
import classes from "./Home.module.css";

const HomePage = () => {
    let [video, setVideo] = useState({});
    let [videoTime, setVideoTime] = useState(null);
    let [isPlaying, setIsPlaying] = useState(false);
    let [previousVideo, setPreviousVideo] = useState(null);
    let [nextVideo, setNextVideo] = useState(null);
    let playerRef = useRef();

    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

    useEffect(() => {
        getVideoData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    let getVideoData = async () => {
        // get current video data from api
        let response = await fetch("api/current_data/");
        let data = await response.json();
        // update time
        setVideoTime(data.time);

        if (data.video.id !== video.id) {
            // update data if video changed
            setVideo(data.video);
            setPreviousVideo(data.previous_video);
            setNextVideo(data.next_video);
            return true;
        } else {
            return false;
        }
    };

    let playNextVid = async () => {
        if (!(await getVideoData())) {
            // wait and try again if video didn't changed
            await sleep(2000);
            if (await getVideoData()) {
                setIsPlaying(true);
            }
        } else {
            setIsPlaying(true);
        }
    };

    let videoUpdate = async () => {
        await getVideoData();
        await playerRef.current.seekTo(videoTime);
        setIsPlaying(true);
    };

    return Object.keys(video).length > 0 ? (
        <div className="container">
            <div className={`${classes["video-preview-previous"]} ${classes["side-content"]}`}>
                <VideoPreview
                    video={previousVideo}
                    isLoading={video.length === 0 ? true : false}
                    heading="Previous"
                />
            </div>
            <div className={classes["center-content"]}>
                <ReactPlayer
                    className={classes.player}
                    ref={playerRef}
                    url={video.url}
                    controls={true}
                    playing={isPlaying}
                    onEnded={playNextVid}
                    onPause={() => {
                        setIsPlaying(false);
                    }}
                    width="100%"
                    height="100%"
                    config={{
                        youtube: {
                            playerVars: {
                                start: videoTime,
                                disablekb: 1,
                            },
                        },
                    }}
                />
            </div>
            <div className={`${classes["video-preview-next"]} ${classes["side-content"]}`}>
                <VideoPreview
                    video={nextVideo}
                    isLoading={video.length === 0 ? true : false}
                    heading="Next"
                />
            </div>
            <div className="break"></div>
            <div className={classes["button-container"]}>
                <button
                    className={classes["live-button"]}
                    onClick={() => {
                        videoUpdate();
                    }}
                >
                    Live
                </button>
            </div>
        </div>
    ) : (
        <div className="container">
            <Loading />
        </div>
    );
};

export default HomePage;
