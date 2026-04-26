import { Link } from "react-router-dom";

function Nav() {
  return (
    <>
      <nav className="nav">
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-link" to="/class">Class</Link>
        <Link className="nav-link" to="/Leaderboard">Leaderboard</Link>
      </nav>
    </>
  );
}

export default Nav;