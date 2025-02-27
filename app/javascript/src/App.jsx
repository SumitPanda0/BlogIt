import React from "react";

import {
  Route,
  Switch,
  BrowserRouter as Router,
  Redirect,
} from "react-router-dom";

import List from "./components/List";
import Posts from "./components/Posts";
import Sidebar from "./components/Sidebar";

const App = () => (
  <Router>
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-16 flex-1 overflow-auto p-6">
        <Switch>
          <Route exact component={Posts} path="/blogs" />
          <Route exact component={List} path="/list" />
          <Route exact path="/">
            <Redirect to="/blogs" />
          </Route>
        </Switch>
      </div>
    </div>
  </Router>
);

export default App;
