import { Link } from "react-router-dom";
import MiniNav from "./MiniNav";
import logo from "./assets/logo.png";

function MiniHeader() {
  return (
    <>
      <header className="mini-header">
        <Link className="mini-header-link" to="/">
          <img className="logo" alt="logo" src={logo} />
        </Link>
        <MiniNav />
      </header>
    </>
  );
}

export default MiniHeader;