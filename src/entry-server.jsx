import React from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App.jsx";

// Used only at build time (scripts/prerender.mjs) to put the page's text into
// index.html, so search and AI crawlers that don't run scripts can read it.
export const render = () =>
  renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
