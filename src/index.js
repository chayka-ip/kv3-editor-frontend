import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import "./css/graph.css";
import "./css/propertyTable.css";
import "./css/connectionLine.css";
import "./css/splitScreen.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  // Strict mode produces errors when findDOM... is used
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,

  <React.Fragment>
    <App />
  </React.Fragment>,

  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
