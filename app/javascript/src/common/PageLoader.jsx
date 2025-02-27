import React from "react";

import { Spinner } from "@bigbinary/neetoui";

export const PageLoader = () => (
  <div className="mx-auto flex h-[80vh] items-center justify-center">
    <Spinner />
  </div>
);
