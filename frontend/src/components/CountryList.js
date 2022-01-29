import { React, useRef, useEffect } from "react";
import classes from "./CountryList.module.css";
import leftArrowImg from './images/arrowLeft.png';
import rightArrowImg from './images/arrowRight.png';

function CountryList(props) {
    let listRef = useRef();
    let leftButtonRef = useRef();
    let rightButtonRef = useRef();

    let scroll = (scrollOffset) => {
        listRef.current.scrollLeft += scrollOffset;
    };

    let getRows = (regions) => {
        // Render list of countries
        if (regions) {
            return Object.keys(regions).map((code, index) =>
                code !== props.regionCode ? (
                    <li key={code} id={code}>
                        {regions[code]}
                    </li>
                ) : (
                    <li key={code} className={classes.selected} id={code}>
                        {regions[code]}
                    </li>
                )
            );
        }
    };

    useEffect(() => {
        leftButtonRef.current.style.boxShadow = "none";

        if (listRef.current.scrollWidth > listRef.current.clientWidth) {
            // side buttons shadows
            listRef.current.addEventListener("scroll", (event) => {
                if (listRef.current.scrollLeft === 0) {
                    leftButtonRef.current.style.boxShadow = "none";
                    leftButtonRef.current.style.backgroundImage = 'none';
                } else {
                    leftButtonRef.current.style.backgroundImage = `url(${leftArrowImg})`; 
                    leftButtonRef.current.style.boxShadow = "15px 0 8px rgb(43, 43, 43)";
                }

                if (
                    listRef.current.scrollWidth - listRef.current.scrollLeft - listRef.current.clientWidth <
                    1
                ) {
                    rightButtonRef.current.style.boxShadow = "none";
                    rightButtonRef.current.style.backgroundImage = 'none';
                } else {
                    rightButtonRef.current.style.boxShadow = "-15px 0 8px rgb(43, 43, 43)";
                    rightButtonRef.current.style.backgroundImage = `url(${rightArrowImg})`; 
                }
            });

            // scrolling list with wheel
            listRef.current.addEventListener("wheel", (event) => {
                event.preventDefault();
                scroll(2 * event.deltaY);
            });
        } else {
            rightButtonRef.current.style.boxShadow = "none";
        }

        listRef.current.addEventListener("click", (event) => {
            if (event.target.tagName.toLowerCase() === "li") {
                let regionCode = event.target.id;
                // pass region code to parent component
                props.setRegionCode(regionCode);
                listRef.current
                    .querySelectorAll(`.${classes.selected}`)
                    .forEach((e) => e.classList.remove(classes.selected));
                event.target.classList.add(classes.selected);
            }
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={classes.list}>
            <button
                ref={leftButtonRef}
                className={`${classes.button} ${classes["left-button"]}`}
                onClick={() => {
                    scroll(-290);
                }}
            />
            <ul ref={listRef}>{getRows(props.regions)}</ul>
            <button
                ref={rightButtonRef}
                className={`${classes.button} ${classes["right-button"]}`}
                onClick={() => {
                    scroll(290);
                }}
            />
        </div>
    );
}

export default CountryList;
