import React, { useState, useEffect } from "react";
import VideoList from "../components/VideoList";
import CountryList from "../components/CountryList";
import classes from "./TopVideos.module.css";
import ReactPlayer from "react-player";
import AnimateHeight from "react-animate-height";
import Loading from "../components/Loading";
import playImg from '../components/images/playIcon.png'


const TopVideosPage = () => {
    let [videos, setVideos] = useState([]);
    let [listItem, setListItem] = useState(null);
    let [listItemId, setListItemId] = useState("");
    let [regionCode, setRegionCode] = useState("PL");
    let [urls, setUrls] = useState([]);
    let [playerWrapperHeight, setPlayerWrapperHeight] = useState(0);
    let [playerHeight, setPlayerHeight] = useState("100%");
    let [isPlaying, setIsPlaying] = useState(false);
    let [videoListRef, setVideoListRef] = useState(null);
    let regions = {
        PL: "Poland",
        US: "United States",
        JP: "Japan",
        GB: "United Kingdom",
        FR: "France",
        KR: "South Korea",
        CA: "Canada",
        AU: "Australia",
        BR: "Brazil",
    };

    useEffect(() => {
        getPlaylist(regionCode);
    }, [regionCode]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        document.addEventListener("scroll", (event) => {
            if (window.pageYOffset > 0) {
                document
                    .getElementsByClassName(classes.player)[0]
                    ?.classList?.add(classes["mini-player"]);
            } else {
                document
                    .getElementsByClassName(classes.player)[0]
                    ?.classList?.remove(classes["mini-player"]);
            }
        });
        window.addEventListener("resize", updatePlayerHeight);
        updatePlayerHeight();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    let updatePlayerHeight = () => {
        if (document.getElementsByClassName(classes.player)[0]) {
            let height = (document.getElementsByClassName(classes.player)[0].clientWidth / 16) * 9;
            setPlayerHeight(height);
        } else {
            window.removeEventListener("resize", updatePlayerHeight);
        }
    };

    let playSingleVideo = (ref, index) => {
        // add class 'selected' to clicked video from list
        let allVid = videoListRef.querySelectorAll(`.${classes.selected}`);
        allVid.forEach((e) => e.classList.remove(classes.selected));
        ref.classList.add(classes.selected);
        // play video
        setListItem(ref);
        setListItemId(index);
        setUrls(Object.values(videos)[index]["url"]);
        setIsPlaying(true);
        setPlayerWrapperHeight("auto");
    };

    let getPlaylist = async (code) => {
        // get playlist by region code
        setVideos([]);
        let response = await fetch(`api/playlist/${code}/`);
        let data = await response.json();
        setVideos(data["videos_data"]);
        setIsPlaying(false);
        setPlayerWrapperHeight(0);
    };

    let playNext = () => {
        // play next video from playlist
        listItem.classList.remove(classes.selected);
        let nextId = listItemId + 1;
        if (listItem.nextSibling) {
            listItem.nextSibling.classList.add(classes.selected);
        } else {
            videoListRef.firstChild.classList.add(classes.selected);
            nextId = 0;
        }
        setUrls(Object.values(videos)[nextId]["url"]);
        setIsPlaying(true);
    };

    return (
        <div className="container">
            <CountryList regions={regions} regionCode={regionCode} setRegionCode={setRegionCode} />
            <div className={classes["button-container"]}>
                <button
                    className={classes.button}
                    onClick={() => {
                        playSingleVideo(videoListRef.firstChild, 0);
                    }}
                >
                    <img src={playImg} alt="play" />
                    <span className={classes.text}>Play</span>
                </button>
            </div>
            <div className="break"></div>
            <AnimateHeight className={classes.player} duration={500} height={playerWrapperHeight}>
                <ReactPlayer
                    width="100%"
                    height={playerHeight}
                    onPlay={() => {
                        setIsPlaying(true);
                    }}
                    url={urls}
                    controls={true}
                    playing={isPlaying}
                    onPause={() => {
                        setIsPlaying(false);
                    }}
                    onEnded={() => {
                        playNext();
                    }}
                />
            </AnimateHeight>
            <div className="break"></div>
            {videos?.length === 0 ? (
                <Loading />
            ) : (
                <VideoList videos={videos} onClick={playSingleVideo} setRef={setVideoListRef} />
            )}
        </div>
    );
};

export default TopVideosPage;
