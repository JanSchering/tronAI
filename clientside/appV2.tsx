import * as React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Home } from "./pages/home";
import { Mode } from "./pages/mode";
import { OnlineSetup } from "./pages/onlineSetup";

const App = () => {
  return (
    <React.Fragment>
      (
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/mode">About</Link>
              </li>
              <li>
                <Link to="/home">Home</Link>
              </li>
            </ul>
          </nav>

          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/home">
              <Home />
            </Route>
            <Route path="/mode">
              <Mode />
            </Route>
            <Route path="/onlinesetup">
              <OnlineSetup />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </React.Fragment>
  );
};

render(<App />, document.getElementById("root"));
