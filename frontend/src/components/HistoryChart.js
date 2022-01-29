import { React, useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Label } from "recharts";
import classes from "./HistoryChart.module.css";

const HistoryList = (props) => {
    let renderLineChart = "";
    let [chartHeight, setChartHeight] = useState(0);

    useEffect(() => {
        window.addEventListener("resize", updateChartHeight);
        updateChartHeight();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    let updateChartHeight = () => {
        // update chart height
        if (document.getElementsByClassName(classes["chart-container"])[0]) {
            let height = document.getElementsByClassName(classes["chart-container"])[0].clientWidth / 2;
            setChartHeight(height);
        } else {
            window.removeEventListener("resize", updateChartHeight);
        }
    };

    if (props.data[props.regionCode][props.year] && props.data[props.regionCode][props.year][props.month]) {
        let data = props.data[props.regionCode][props.year][props.month].map((item) => ({
            date: item.date.slice(-2),
            place: item.index,
        }));

        renderLineChart = (
            <ResponsiveContainer className={classes["recharts-responsive-container"]}>
                <LineChart data={data} margin={{ top: 10, right: 20, bottom: 30, left: -20 }}>
                    <Line type="monotone" dataKey="place" stroke="red" />
                    <XAxis dataKey="date" angle={-35} textAnchor="end">
                        <Label
                            className={classes.label}
                            value="Day of the month"
                            position="bottom"
                            style={{ textAnchor: "middle", fill: "#999" }}
                        />
                    </XAxis>
                    <YAxis domain={[1, 10]} type={"number"} reversed={true} tickCount={10} interval={0}>
                        <Label
                            className={classes.label}
                            angle={-90}
                            value="Top 10 list"
                            style={{ textAnchor: "middle", fill: "#999" }}
                        />
                    </YAxis>
                </LineChart>
            </ResponsiveContainer>
        );
    }
    return (
        <div className={classes["chart-container"]} style={{ height: chartHeight, minHeight: 200 }}>
            {renderLineChart}
        </div>
    );
};

export default HistoryList;
