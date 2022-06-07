import React, { useEffect } from "react";
import GraphEditor from "./components/graph/graphEditor";
import * as config from "../src/config.json";

import "./App.css";

export function useTitle(title) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    return () => {
      document.title = prevTitle;
    };
  });
}

function App() {
  useTitle(config.title);
  return (
    <React.Fragment>
      <GraphEditor />
    </React.Fragment>
  );
}

export default App;
