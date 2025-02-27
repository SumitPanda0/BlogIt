import React from "react";

import { List, Book } from "@bigbinary/neeto-icons";
import { Avatar, Button } from "@bigbinary/neetoui";
import classnames from "classnames";
import { equals } from "ramda";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const isActive = path => equals(location.pathname, path);

  const getButtonClass = path =>
    classnames("transition-colors", {
      "text-blue-500": isActive(path),
      "text-gray-700": !isActive(path),
    });

  return (
    <div className="fixed flex h-full w-16 flex-col items-center py-6 text-white shadow-lg">
      <div className="flex flex-col space-y-6">
        <NavLink
          activeClassName="bg-gray-100"
          className="rounded-lg p-3 transition-colors hover:bg-gray-100"
          title="Blog Posts"
          to="/blogs"
          onClick={e => {
            if (isActive("/blogs")) {
              e.preventDefault();
            }
          }}
        >
          <Button
            className={getButtonClass("/blogs")}
            icon={Book}
            style="link"
          />
        </NavLink>
        <NavLink
          activeClassName="bg-gray-100"
          className="rounded-lg p-3 transition-colors hover:bg-gray-100"
          title="List"
          to="/list"
          onClick={e => {
            if (isActive("/list")) {
              e.preventDefault();
            }
          }}
        >
          <Button
            className={getButtonClass("/list")}
            icon={List}
            style="link"
          />
        </NavLink>
      </div>
      <div className="mb-4 mt-auto">
        <NavLink
          activeClassName="text-blue-500"
          className="transition-colors"
          title="Profile"
          to="/profile"
          onClick={e => {
            if (isActive("/profile")) {
              e.preventDefault();
            }
          }}
        >
          <Avatar size="medium" user={{ name: "User" }} />
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
