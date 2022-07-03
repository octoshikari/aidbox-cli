import React from "react";
import ReactDOM from "react-dom";
import { App } from "./application";
import "./index.css";
import { RouterProvider } from "atomic-router-react";
import { router } from "./routes";

const root = document.querySelector("#root");

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </React.StrictMode>,
  root as HTMLElement,
);
