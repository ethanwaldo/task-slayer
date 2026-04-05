import { Link } from "react-router-dom";
import MiniHomeHeader from "./MiniHomeHeader";

function Header() {
  return (
    <>
      <header className="home-header">
        <nav className="nav">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/class">Class</Link>
        </nav>
      </header>
      <MiniHomeHeader />
    </>
  );
}

export default Header;