import classnames from "classnames";
import { equals } from "ramda";

export const isActivePath = (currentPath, targetPath) =>
  equals(currentPath, targetPath);

export const getNavButtonClass = (currentPath, targetPath) =>
  classnames("transition-colors", {
    "text-blue-500": isActivePath(currentPath, targetPath),
    "text-gray-700": !isActivePath(currentPath, targetPath),
  });

export const getNavLinkClass = () =>
  "rounded-lg p-3 transition-colors hover:bg-gray-100";

export const getSidebarPaneClass = isOpen =>
  classnames(
    "h-[100vh] overflow-hidden bg-gray-300 shadow-lg transition-all duration-300 ease-in-out",
    {
      "w-64 opacity-100 visible": isOpen,
      "w-0 opacity-0 invisible": !isOpen,
    }
  );

export const getToggleButtonClass = isActive =>
  classnames(
    "cursor-pointer rounded-lg p-3 transition-colors hover:bg-gray-100",
    {
      "bg-gray-100": isActive,
    }
  );

export const getToggleIconClass = isActive =>
  classnames({
    "text-blue-500": isActive,
    "text-gray-700": !isActive,
  });
