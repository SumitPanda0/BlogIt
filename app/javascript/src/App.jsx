import React from "react";

import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Home from "./Home";

const App = () => (
  <Router>
    <ToastContainer />
    <Home />
  </Router>
);

export default App;
