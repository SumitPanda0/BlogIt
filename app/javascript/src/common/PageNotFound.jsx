import React from "react";

import { NoData } from "@bigbinary/neetoui";

import { BASE_URL } from "../components/constants";
import withTitle from "../utils/withTitle";

const PageNotFound = () => (
  <div className="flex h-screen items-center justify-center">
    <NoData
      title={"The page you're looking for can't be found"}
      primaryButtonProps={{
        label: "Back to home",
        className: "bg-neutral-800 hover:bg-neutral-950",
        to: BASE_URL,
      }}
    />
  </div>
);

export default withTitle(PageNotFound, "Page Not Found");
