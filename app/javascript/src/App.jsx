import React from "react";

import { either, isEmpty, isNil } from "ramda";
import {
  Route,
  Switch,
  BrowserRouter as Router,
  Redirect,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

import UserPosts from "components/Posts/UserPosts";

import PrivateRoute from "./common/PrivateRoute";
import { Login, Signup } from "./components/Authentication";
import List from "./components/List";
import Posts from "./components/Posts";
import CreatePost from "./components/Posts/Create";
import DownloadReport from "./components/Posts/DownloadReport";
import EditPost from "./components/Posts/Edit";
import FullPagePreview from "./components/Posts/FullPagePreview";
import ShowPost from "./components/Posts/Show";
import Sidebar from "./components/Sidebar";
import { getFromLocalStorage } from "./utils/storage";

const App = () => {
  const authToken = getFromLocalStorage("authToken");
  const isLoggedIn = !either(isNil, isEmpty)(authToken);

  return (
    <Router>
      <ToastContainer />
      <div className="flex h-screen">
        <Sidebar />
        <div className="ml-8 flex-1 overflow-auto p-6 transition-all duration-300">
          <Switch>
            <Route exact component={CreatePost} path="/posts/create" />
            <Route exact component={ShowPost} path="/posts/:slug/show" />
            <Route exact component={EditPost} path="/posts/:slug/edit" />
            <Route exact component={DownloadReport} path="/posts/report" />
            <Route
              exact
              component={FullPagePreview}
              path="/posts/preview/:slug"
            />
            <Route exact component={Signup} path="/signup" />
            <Route exact component={Login} path="/login" />
            <PrivateRoute
              component={ShowPost}
              condition={isLoggedIn}
              path="/posts/:slug/show"
              redirectRoute="/login"
            />
            <Route exact path="/posts">
              <Posts />
            </Route>
            <Route exact component={List} path="/list" />
            <Route exact path="/">
              <Redirect to="/posts" />
            </Route>
            <PrivateRoute
              component={UserPosts}
              condition={isLoggedIn}
              path="/my-posts"
              redirectRoute="/login"
            />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
