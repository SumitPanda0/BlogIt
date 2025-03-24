import React from "react";

import { either, isEmpty, isNil } from "ramda";
import { Route, Switch, Redirect } from "react-router-dom";

import UserPosts from "components/Posts/UserPosts";

import PageNotFound from "./common/PageNotFound";
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
import { routes } from "./routes";
import { getFromLocalStorage } from "./utils/storage";

const Home = () => {
  const authToken = getFromLocalStorage("authToken");
  const isLoggedIn = !either(isNil, isEmpty)(authToken);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="ml-8 flex-1 overflow-auto p-6 transition-all duration-300">
        <Switch>
          <Route exact component={CreatePost} path={routes.CREATE_POST} />
          <Route exact component={ShowPost} path={routes.SHOW_POST} />
          <Route exact component={EditPost} path={routes.EDIT_POST} />
          <Route
            exact
            component={DownloadReport}
            path={routes.DOWNLOAD_REPORT}
          />
          <Route exact component={FullPagePreview} path={routes.PREVIEW_POST} />
          <Route exact component={Signup} path={routes.SIGNUP} />
          <Route exact component={Login} path={routes.LOGIN} />
          <PrivateRoute
            component={ShowPost}
            condition={isLoggedIn}
            path={routes.SHOW_POST}
            redirectRoute={routes.LOGIN}
          />
          <Route exact path={routes.POSTS}>
            <Posts />
          </Route>
          <Route exact component={List} path={routes.LIST} />
          <Route exact path={routes.ROOT}>
            <Redirect to={routes.POSTS} />
          </Route>
          <PrivateRoute
            component={UserPosts}
            condition={isLoggedIn}
            path={routes.USER_POSTS}
            redirectRoute={routes.LOGIN}
          />
          <Route component={PageNotFound} path={routes.PAGE_NOT_FOUND} />
        </Switch>
      </div>
    </div>
  );
};

export default Home;
