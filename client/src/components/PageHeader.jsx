import { useState } from "react";
import { Link } from "react-router-dom";
import { GiCrossedSwords } from "react-icons/gi";
import { FaBars, FaTimes } from "react-icons/fa";
import { post } from "../requests";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/shop", label: "Shop" },
];

async function logout() {
  await post("/api/auth/logout", {});
  window.location.reload();
}

export default function PageHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header id="page-header">
      <Link id="page-header-logo-link" to="/">
        <GiCrossedSwords id="logo" />
      </Link>
      <nav id="page-nav" className={open ? "page-nav--open" : ""}>
        {LINKS.map(l => (
          <Link key={l.to} className="page-nav-link" to={l.to} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <a className="page-nav-link" href="#" onClick={e => { e.preventDefault(); logout(); }}>
          Logout
        </a>
      </nav>
      <button id="page-nav-toggle" onClick={() => setOpen(o => !o)}>
        {open ? <FaTimes /> : <FaBars />}
      </button>
    </header>
  );
}
