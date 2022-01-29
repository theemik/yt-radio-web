import "./App.css";
import { Route, HashRouter, Switch } from "react-router-dom";
import MainNavigation from "./components/MainNavigation";
import HomePage from "./pages/Home";
import TopVideosPage from "./pages/TopVideos";
import HistoryBrowserPage from "./pages/HistoryBrowser";
import HistoryDetailsPage from "./pages/HistoryDetails";

function App() {
    return (
        <div className="App">
            <HashRouter>
                <MainNavigation />
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/top" component={TopVideosPage} />
                    <Route exact path="/history" component={HistoryBrowserPage} />
                    <Route exact path="/history/:id" component={HistoryDetailsPage} />
                </Switch>
            </HashRouter>
        </div>
    );
}

export default App;
