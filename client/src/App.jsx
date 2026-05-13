import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ClassPage from "./ClassPage";
import Home from "./Home";
import Leaderboard from "./components/Leaderboard";
import Login from "./Login";
import "./global.css";

function Navigation({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";
  const isBottomActive = (path) => location.pathname === path ? "bottom-nav-item active" : "bottom-nav-item";

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    onLogout();
    navigate("/login");
  }

  function openNavMenu() {
    setNavMenuOpen(true);
  }

  function closeNavMenu() {
    setNavMenuOpen(false);
  }

  return (
    <>
      <nav className="top-nav">
        <div className="top-nav-logo">
          <div className="top-nav-icon">
            <span className="material-symbols-outlined text-white">swords</span>
          </div>
          <span className="top-nav-title">Task Slayer</span>
        </div>
        <div className="nav-links">
          <Link className={isActive("/")} to="/">Quests</Link>
          <Link className={isActive("/class")} to="/class">Hero</Link>
          <Link className={isActive("/leaderboard")} to="/leaderboard">Leaderboard</Link>
        </div>
        <div className="top-nav-right" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div className="gold-badge">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
            <span>2,450 GP</span>
          </div>
          <button onClick={handleLogout} style={{ background: "transparent", color: "var(--color-text-muted)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </nav>
      {!navMenuOpen &&
        <header className="z-1 fixed flex justify-end top-0 left-0 md:hidden bg-[rgba(11,5,20,0.8)] backdrop-blur-xs w-full">
          <button className="cursor-pointer mt-1 mr-2" onClick={openNavMenu}>
            <span className="material-symbols-outlined text-4xl!">
              {navMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </header>
      }
      {navMenuOpen &&
        <div className="z-1 fixed flex flex-col w-full h-full items-center bg-[rgba(11,5,20,0.8)] backdrop-blur-xs">
          <header className="flex justify-end md:hidden w-full">
            <button className="cursor-pointer mt-1 mr-2" onClick={closeNavMenu}>
              <span className="material-symbols-outlined text-4xl!">
                {navMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </header>
          <nav className="w-7/10 mt-20 flex flex-col gap-y-4">
            <Link className={`h-14 rounded-full border border-border w-full flex flex-col items-center gap-y-1 justify-center text-text-muted bg-[rgb(15,23,42)] ${isBottomActive("/")}`} onClick={closeNavMenu} to="/">
              <span className="text-[0.65rem] font-bold uppercase material-symbols-outlined">grid_view</span>
              <span className="text-[0.65rem] font-bold uppercase">Quests</span>
            </Link>
            <Link className={`h-14 rounded-full border border-border w-full flex flex-col items-center gap-y-1 justify-center text-text-muted bg-[rgb(15,23,42)] ${isBottomActive("/class")}`} onClick={closeNavMenu} to="/class">
              <span className="text-[0.65rem] font-bold uppercase material-symbols-outlined">person</span>
              <span className="text-[0.65rem] font-bold uppercase">Hero</span>
            </Link>
            <Link className={`h-14 rounded-full border border-border w-full flex flex-col items-center gap-y-1 justify-center text-text-muted bg-[rgb(15,23,42)] ${isBottomActive("/leaderboard")}`} onClick={closeNavMenu} to="/leaderboard">
              <span className="text-[0.65rem] font-bold uppercase material-symbols-outlined">leaderboard</span>
              <span className="text-[0.65rem] font-bold uppercase">Leaderboard</span>
            </Link>
          </nav>
        </div>
      }
    </>
  );
}

function InsideRouter() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading

  useEffect(() => {
    fetch("/api/profile")
      .then(res => {
        if (res.ok && res.status !== 401) setIsAuthenticated(true);
        else setIsAuthenticated(false);
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) return <div style={{ color: "white", padding: "40px", textAlign: "center" }}>Loading the realm...</div>;

  return (
    <div className="app-container">
      {isAuthenticated && <Navigation onLogout={() => setIsAuthenticated(false)} />}
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login onLogin={() => setIsAuthenticated(true)} /> : <Navigate to="/" />} />
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/class" element={isAuthenticated ? <ClassPage /> : <Navigate to="/login" />} />
        <Route path="/leaderboard" element={isAuthenticated ? <Leaderboard /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <InsideRouter />
    </Router>
  );
}

export default App;