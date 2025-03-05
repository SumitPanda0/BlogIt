import React, { useState } from "react";

import { List, Book, Edit, ListDetails } from "@bigbinary/neeto-icons";
import { Avatar, Button } from "@bigbinary/neetoui";
import { NavLink, useLocation, useHistory } from "react-router-dom";

import Pane from "./Pane";

import { POSTS, LIST, PROFILE, CREATE_POST } from "../constants";
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

  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get("category_ids");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(
    categoryParam ? categoryParam.split(",").map(Number) : []
  );

  const toggleCategorySidebar = () => {
    setIsCategorySidebarOpen(!isCategorySidebarOpen);
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
        </div>
        <div className="mb-4 mt-auto items-center">
          <NavLink
            activeClassName="text-blue-500"
            className="transition-colors"
            title="Profile"
            to={PROFILE}
            onClick={event => {
              if (location.pathname === PROFILE) {
                event.preventDefault();
              }
            }}
          >
            <Avatar size="medium" user={{ name: "User" }} />
          </NavLink>
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
