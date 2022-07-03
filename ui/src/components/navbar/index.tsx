import { Link } from "atomic-router-react";
import { homeRoute, restConsoleRoute } from "../../routes";
import "./index.css";
import { FC } from "react";
import { LeftArrowIcon } from "../../icons/left-arrow";

export const Navbar: FC<{ isOpen: boolean; toggle: () => void }> = ({ isOpen, toggle }) => {
  return (
    <div className="navbar">
      <div className="navbar-items">
        <Link to={homeRoute} className="navbar-item">Home</Link>
        <Link to={restConsoleRoute} className="navbar-item">REST Console</Link>
      </div>
      <div className="navbar-collapse" onClick={() => toggle()}>
          <div>
         <LeftArrowIcon flip={!isOpen} width={isOpen ? "40" :"20"} />
          </div>
      </div>
    </div>
  );
};
