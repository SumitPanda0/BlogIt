import React from "react";

import {
  Route,
  Switch,
  BrowserRouter as Router,
  Redirect,
} from "react-router-dom";

import List from "./components/List";
import Posts from "./components/Posts";
import CreatePost from "./components/Posts/Create";
import ShowPost from "./components/Posts/Show";
import Sidebar from "./components/Sidebar";

const App = () => (
  <Router>
    <div className="flex h-screen">
      <Sidebar />
      <div className="ml-16 flex-1 overflow-auto p-6">
        <Switch>
          <Route exact component={ShowPost} path="/posts/:slug/show" />
          <Route exact component={CreatePost} path="/posts/create" />
          <Route exact component={Posts} path="/posts" />
          <Route exact component={List} path="/list" />
          <Route exact path="/">
            <Redirect to="/posts" />
          </Route>
        </Switch>
      </div>
    </div>
  </Router>
);

export default App;
