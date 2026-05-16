import { Link } from "react-router-dom";

function Nav() {
  return (
    <>
      <nav className="nav">
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-link" to="/class">Class</Link>
        <Link className="nav-link" to="/shop">Shop</Link>
        <Link className="nav-link" to="/leaderboard">Leaderboard</Link>
      </nav>
    </>
  );
}

export default Nav;