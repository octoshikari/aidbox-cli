import { createHistoryRouter, createRoute } from "atomic-router";
import { createBrowserHistory } from "history";

export const homeRoute = createRoute();
export const restConsoleRoute = createRoute();

export const routes = [
  { path: "/", route: homeRoute },
  { path: "/rest", route: restConsoleRoute },
];

const history = createBrowserHistory();

export const router = createHistoryRouter({ routes });

router.setHistory(history);
