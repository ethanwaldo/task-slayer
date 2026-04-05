import { Link } from "react-router-dom";
import logo from "./assets/logo.png";
import MiniHeader from "./MiniHeader";

function Header() {
  return (
    <>
      <header className="class-header">
        <div className="header-link-container">
          <Link className="header-link" to="/">
            <img className="logo" alt="logo" src={logo} />
          </Link>
        </div>
        <h1 className="header-page-heading">Select Class</h1>
        <nav className="nav">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/class">Class</Link>
        </nav>
      </header>
      <MiniHeader />
    </>
  );
}

export default Header;