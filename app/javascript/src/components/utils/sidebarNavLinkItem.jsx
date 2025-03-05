import React from "react";

import { Button } from "@bigbinary/neetoui";
import { NavLink } from "react-router-dom";

import { getNavButtonClass, getNavLinkClass } from "./sidebarStyleClasses";

export const SidebarNavLinkItem = ({ path, title, icon, currentPath }) => (
  <NavLink
    exact
    activeClassName="bg-gray-100"
    className={getNavLinkClass()}
    title={title}
    to={path}
  >
    <Button
      className={getNavButtonClass(currentPath, path)}
      icon={icon}
      style="link"
    />
  </NavLink>
);
