import React, { useState } from "react";

import {
  List,
  Book,
  Edit,
  ListDetails,
  Close,
  Home,
  Folder,
} from "@bigbinary/neeto-icons";
import { Avatar, Button, Dropdown, Typography } from "@bigbinary/neetoui";
import { useLocation, useHistory } from "react-router-dom";

import authApi from "apis/auth";
import { resetAuthTokens } from "apis/axios";

import Pane from "./Pane";

import { getFromLocalStorage, setToLocalStorage } from "../../utils/storage";
import { POSTS, LIST, CREATE_POST } from "../constants";
import { SidebarNavLinkItem } from "../utils/sidebarNavLinkItem";
import {
  getSidebarPaneClass,
  getToggleButtonClass,
  getToggleIconClass,
} from "../utils/sidebarStyleClasses";

const Sidebar = () => {
  const location = useLocation();
  const history = useHistory();
  const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(false);
  const userName = getFromLocalStorage("authUserName");
  const isLoggedIn = !!getFromLocalStorage("authToken");

  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get("category_ids");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(
    categoryParam ? categoryParam.split(",").map(Number) : []
  );

  const toggleCategorySidebar = () => {
    setIsCategorySidebarOpen(!isCategorySidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setToLocalStorage({
        authToken: null,
        email: null,
        userId: null,
        userName: null,
      });
      resetAuthTokens();
      window.location.href = "/";
    } catch (error) {
      logger.error(error);
    }
  };

  const handleLogin = () => {
    history.push("/login");
  };

  const handleCategorySelect = categoryIds => {
    setSelectedCategoryIds(categoryIds);

    let path = POSTS;
    if (categoryIds.length > 0) {
      path = `${POSTS}?category_ids=${categoryIds.join(",")}`;
    }

    if (location.pathname === POSTS) {
      history.push(path);
    }
  };

  return (
    <div className="flex h-full w-auto flex-row items-center justify-center py-6 text-white shadow-lg outline-black">
      <div className="flex h-full w-16 flex-col items-center justify-between">
        <div className="flex flex-col items-center space-y-6">
          <SidebarNavLinkItem
            currentPath={location.pathname}
            icon={Book}
            path={POSTS}
            title="Blog Posts"
          />
          <SidebarNavLinkItem
            currentPath={location.pathname}
            icon={List}
            path={LIST}
            title="List"
          />
          <SidebarNavLinkItem
            currentPath={location.pathname}
            icon={Edit}
            path={CREATE_POST}
            title="Add new blog post"
          />
          <div
            className={getToggleButtonClass(isCategorySidebarOpen)}
            title="Categories"
            onClick={toggleCategorySidebar}
          >
            <Button
              className={getToggleIconClass(isCategorySidebarOpen)}
              icon={ListDetails}
              style="link"
            />
          </div>
          <SidebarNavLinkItem
            currentPath={location.pathname}
            icon={Folder}
            path="/my-posts"
            title="My Blog Posts"
          />
        </div>
        <div className="mb-4 mt-auto items-center">
          <Dropdown
            buttonSize="large"
            buttonStyle="tertiary"
            className="flex items-center justify-center"
            closeOnSelect={false}
            position="right"
            customTarget={
              <div className="flex cursor-pointer items-center gap-2">
                <Avatar
                  className="cursor-pointer"
                  size="medium"
                  user={{ name: userName || "Guest" }}
                />
              </div>
            }
          >
            <div className="items-center justify-center rounded-lg shadow-sm">
              {isLoggedIn && (
                <div className="mb-1 flex items-center justify-center">
                  <div>
                    <Typography className="text-lg font-medium text-gray-500">
                      {userName}
                    </Typography>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-center">
                <Button
                  className="bg-white text-gray-700 hover:bg-gray-100"
                  icon={isLoggedIn ? Close : Home}
                  iconPosition="left"
                  label={isLoggedIn ? "Logout" : "Login"}
                  size="medium"
                  style="tertiary"
                  onClick={isLoggedIn ? handleLogout : handleLogin}
                />
              </div>
            </div>
          </Dropdown>
        </div>
      </div>
      <div className={getSidebarPaneClass(isCategorySidebarOpen)}>
        <div className="w-64">
          <Pane
            selectedCategoryIds={selectedCategoryIds}
            onCategorySelect={handleCategorySelect}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
