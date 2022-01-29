import { React, useEffect, useState } from "react";
import CountryList from "../components/CountryList";
import DateSelector from "../components/DateSelector";
import HistoryChart from "../components/HistoryChart";
import classes from "./HistoryDetails.module.css";

const HistoryDetails = ({ match }) => {
    let allRegions = {
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
    let [regions, setRegions] = useState([]);
    let [regionCode, setRegionCode] = useState("");
    let [chartData, setChartData] = useState({});
    let [video, setVideo] = useState({});
    let videoId = match.params.id;

    let [years, setYears] = useState([]);
    let [year, setYear] = useState();
    let [months, setMonths] = useState([]);
    let [month, setMonth] = useState();

    useEffect(() => {
        let fetchData = async () => {
            // get video history from api
            let historyResponse = await fetch(`api/history/${videoId}/`);
            let historyData = await historyResponse.json();

            // data for regions list
            let regionCodes = Object.keys(historyData);
            let regions = {};
            regionCodes.forEach((code) => (regions[code] = allRegions[code]));
            setRegions(regions);
            setRegionCode(regionCodes[0]);

            // data for date selector
            let years = Object.keys(historyData[regionCodes[0]]);
            let months = Object.keys(historyData[regionCodes[0]][years[years.length-1]]);
            setYears(years);
            setYear(years[years.length-1]);
            setMonths(months);
            setMonth(months[months.length-1]);
            setChartData(historyData);

            // get video details from api
            let videoResponse = await fetch(`api/video/${videoId}/`);
            let videoData = await videoResponse.json();
            setVideo(videoData);
        };
        fetchData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        // update available years and months
        if (Object.keys(chartData).length > 0 && regionCode.length > 0) {
            let years = Object.keys(chartData[regionCode]);
            let months = Object.keys(chartData[regionCode][years[years.length-1]]);
            setYears(years);
            setYear(years[years.length-1]);
            setMonths(months);
            setMonth(months[months.length-1]);
        }
    }, [regionCode]);  // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        // update available months
        if (month && year) {
            let months = Object.keys(chartData[regionCode][year]);
            setMonths(months);
            setMonth(months[months.length-1]);
        }
    }, [year]);  // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="container">
            {Object.keys(regions).length > 1 ? (
                <CountryList regions={regions} regionCode={regionCode} setRegionCode={setRegionCode} />
            ) : (
                ""
            )}
            <DateSelector
                years={years}
                year={year}
                setYear={setYear}
                months={months}
                month={month}
                setMonth={setMonth}
            />
            <div className="break"></div>
            <div className={classes["middle-container"]}>
                <div className={classes.header}>
                    <div className={classes.thumbnail}>
                        <img src={video.thumbnail_url} alt="thumbnail" />
                    </div>
                    <div className={classes["video-info"]}>
                        <a className={classes.title} href={video.url} target="_blank" rel="noreferrer">
                            {video.title}
                        </a>
                        <div className={classes.country}>{regionCode ? regions[regionCode] : ""}</div>
                    </div>
                </div>
                <div className="break"></div>
                {Object.keys(chartData).length > 0 ? (
                    <HistoryChart data={chartData} regionCode={regionCode} year={year} month={month} />
                ) : (
                    ""
                )}
            </div>
        </div>
    );
};

export default HistoryDetails;
