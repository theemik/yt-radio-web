import { React, useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import VideoList from "../components/VideoList";
import { useHistory } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../components/Loading";

const History = () => {
    let [keywords, setKeywords] = useState("");
    let [results, setResults] = useState([]);
    let history = useHistory();
    let [pageNumber, setPageNumber] = useState(1);
    let [hasMore, setHasMore] = useState(true);
    let [isLoading, setIsLoading] = useState(false);
    let [refresh, setrefresh] = useState(true); // additional var to refresh 1st page

    useEffect(() => {
        if (keywords) {
            window.scrollTo(0, 0);
            setHasMore(true);
            if (pageNumber === 1) {
                setResults([]);
                setrefresh(refresh ? false : true);
            } else {
                setPageNumber(1);
            }
        }
    }, [keywords]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (pageNumber > 0) {
            getResults();
        }
    }, [refresh, pageNumber]); // eslint-disable-line react-hooks/exhaustive-deps

    let getResults = async () => {
        // get results from api
        if (keywords) {
            setIsLoading(true);
            let response = await fetch(`api/search/${keywords}/?page=${pageNumber}`);
            let data = await response.json();

            if (data.length === 0) {
                setHasMore(false);
            }
            if (pageNumber === 1) {
                setResults(data);
            } else {
                setResults(results.concat(data));
            }
            setIsLoading(false);
        }
    };

    let goToDetails = async (ref, index) => {
        history.push(`/history/${ref.id}`);
    };

    return (
        <div className="container">
            <SearchBar setKeywords={setKeywords} />
            <InfiniteScroll
                dataLength={results.length}
                next={() => {
                    setPageNumber(pageNumber + 1);
                }}
                hasMore={hasMore}
                loader={isLoading ? <Loading /> : null}
            >
                <VideoList videos={results} onClick={goToDetails} />
            </InfiniteScroll>
        </div>
    );
};

export default History;
