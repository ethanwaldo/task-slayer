import { Link } from "react-router-dom";
import MiniNav from "./MiniNav";
import Nav from "./Nav";
import logo from "../assets/logo.png";

export default function Header() {
  return (
    <>
      <header className="class-page-header">
        <div className="header-link-container">
          <Link className="header-link" to="/">
            <img className="logo" alt="logo" src={logo} />
          </Link>
        </div>
        <Nav />
      </header>
      <header className="class-page-mini-header">
        <Link className="mini-header-link" to="/">
          <img className="logo" alt="logo" src={logo} />
        </Link>
        <MiniNav />
      </header>
    </>
  );
}