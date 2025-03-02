// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import "../stylesheets/application.scss";

const componentRequireContext = require.context("src", true);

const { initializeLogger } = require("common/logger");
const { setAuthHeaders } = require("apis/axios");
const initializeAxios = require("apis/axios").default;

initializeLogger();

setAuthHeaders();
initializeAxios();

const ReactRailsUJS = require("react_ujs");
ReactRailsUJS.useContext(componentRequireContext);
