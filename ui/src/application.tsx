import { useEvent, useStore } from "effector-react";
import "./application.css";
import { Route } from "atomic-router-react";
import { Navbar } from "./components/navbar";
import { $isNavbarOpened, navbarToggle } from "./model";
import { homeRoute, restConsoleRoute } from "./routes";

export function App() {
  const toggle = useEvent(navbarToggle);
  const isOpen = useStore($isNavbarOpened);

  return (
    <div className={isOpen ?  "wrapper" : "wrapper wrapper-short" }>
      <Navbar isOpen={isOpen} toggle={toggle} />
      <Content />
    </div>
  );
}

export const RestConsole = () => {
  return <div>Rest Console</div>;
};

export const Home = () => {
  return <div>Home</div>;
};

export const Content = () => {
  return (
    <div>
      <Route route={homeRoute} view={Home} />
      <Route route={restConsoleRoute} view={RestConsole} />
    </div>
  );
};
