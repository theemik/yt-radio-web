import { React } from "react";
import classes from "./DateSelector.module.css";

const DataSelector = (props) => {
    return (
        <div className={classes["form-container"]}>
            <form>
                <label htmlFor="year">Year: </label>
                <select
                    name="year"
                    className={classes.year}
                    value={props.year}
                    onChange={(e) => props.setYear(e.target.value)}
                >
                    {props.years?.map((year) => (
                        <option className={classes.option} value={year} key={'year-' + year}>
                            {year}
                        </option>
                    ))}
                </select>
                <label htmlFor="month">Month: </label>
                <select
                    name="month"
                    className={classes.month}
                    value={props.month}
                    onChange={(e) => props.setMonth(e.target.value)}
                >
                    {props.months?.map((month) => (
                        <option className={classes.option} value={month} key={'month-' + month}>
                            {month}
                        </option>
                    ))}
                </select>
            </form>
        </div>
    );
};

export default DataSelector;
