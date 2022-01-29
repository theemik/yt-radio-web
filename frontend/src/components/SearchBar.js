import { React, useRef, useEffect, useState } from "react";
import classes from "./SearchBar.module.css";

const SearchBar = (props) => {
    let listRef = useRef();
    let searchRef = useRef();
    let formRef = useRef();
    let [hints, setHints] = useState([]);
    let [keywords, setKeywords] = useState("");

    useEffect(() => {
        let fetchData = async () => {
            // get hints from api
            if (keywords) {
                let response = await fetch(`api/hints/${keywords}/`);
                let data = await response.json();
                setHints(keywords ? data : []);
            } else {
                setHints([]);
            }
        };
        fetchData();
    }, [keywords]);

    useEffect(() => {
        let switchHighlight = (direction) => {
            // change highlighted hint according to direction
            if (listRef.current.firstChild) {
                let highlighted = listRef.current.getElementsByClassName(classes.highlighted)[0];
                switch (direction) {
                    case "next":
                        if (highlighted) {
                            highlighted.classList.remove(classes.highlighted);
                            highlighted.nextSibling
                                ? highlighted.nextSibling.classList.add(classes.highlighted)
                                : listRef.current.firstChild.classList.add(classes.highlighted);
                        } else {
                            listRef.current.firstChild.classList.add(classes.highlighted);
                        }
                        break;
                    case "previous":
                        if (highlighted) {
                            highlighted.classList.remove(classes.highlighted);
                            highlighted.previousSibling
                                ? highlighted.previousSibling.classList.add(classes.highlighted)
                                : listRef.current.lastChild.classList.add(classes.highlighted);
                        } else {
                            listRef.current.lastChild.classList.add(classes.highlighted);
                        }
                        break;
                    default:
                        console.log('This function takes only "previous", or "next" values.');
                }
                highlighted = listRef.current.getElementsByClassName(classes.highlighted)[0];
                searchRef.current.value = highlighted.innerText;
            }
        };
        
        // show/hide hints
        searchRef.current.addEventListener("focusin", () => {
            listRef.current.style.display = "block";
        });

        searchRef.current?.addEventListener("focusout", (event) => {
            // search with clicked hint value
            if (listRef.current){
                let list = listRef.current.querySelectorAll(':hover');
                let element = list[list.length - 1];
                if (element && element.classList.contains(classes.hint)) {
                    event.target.value = element.innerText;
                    formRef.current.dispatchEvent(new Event("submit"));
                }
                listRef.current.style.display = "none";
            }
        });

        // arrow up/down, update keywords
        searchRef.current.addEventListener("keyup", (event) => {
            switch (event.key) {
                case "ArrowDown":
                    switchHighlight("next");
                    break;
                case "ArrowUp":
                    switchHighlight("previous");
                    break;
                default:
                    setKeywords(event.target.value);
            }
        });

        // Submit search form
        formRef.current.addEventListener("submit", (event) => {
            event.preventDefault();
            props.setKeywords(searchRef.current.value.trim());
            searchRef.current.value = "";
            setKeywords("");
            setHints([]);
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={classes["search-container"]}>
            <form ref={formRef} className={classes.search}>
                <div className={classes["search-bar"]}>
                    <input type="search" ref={searchRef} placeholder="Search here..." required />
                    <button
                        type="submit"
                        className={classes.submit}
                    />
                </div>
                <ul ref={listRef}>
                    {hints.slice(0, 7).map((hint) => (
                        <li className={classes.hint} key={hint.id}>{hint.name}</li>
                    ))}
                </ul>
            </form>
        </div>
    );
};

export default SearchBar;
