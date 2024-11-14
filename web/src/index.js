import React from "react";
import { render } from "react-dom";

import { AppWrapper } from "./AppWrapper";
import reportWebVitals from "./reportWebVitals";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/js/bootstrap.min.js";
import "react-toastify/dist/ReactToastify.css";
import "assets/styles/main.css";

render(<AppWrapper />, document.getElementById("root"));

reportWebVitals();
