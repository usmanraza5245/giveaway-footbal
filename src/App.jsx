import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Practice from "./Practice";
import Result from "./Result";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Practice} />
        <Route path="/Result" component={Result} />
      </Switch>
    </Router>
  );
};

export default App;
