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
  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";
  const isBottomActive = (path) => location.pathname === path ? "bottom-nav-item active" : "bottom-nav-item";

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    onLogout();
    navigate("/login");
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

      <nav className="bottom-nav">
        <Link className={isBottomActive("/")} to="/">
          <span className="material-symbols-outlined">grid_view</span>
          <span>Quests</span>
        </Link>
        <Link className={isBottomActive("/class")} to="/class">
          <span className="material-symbols-outlined">person</span>
          <span>Hero</span>
        </Link>
        <Link className={isBottomActive("/leaderboard")} to="/leaderboard">
          <span className="material-symbols-outlined">leaderboard</span>
          <span>Leaderboard</span>
        </Link>
      </nav>
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
      <main className="main-content">
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login onLogin={() => setIsAuthenticated(true)} /> : <Navigate to="/" />} />
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path="/class" element={isAuthenticated ? <ClassPage /> : <Navigate to="/login" />} />
          <Route path="/leaderboard" element={isAuthenticated ? <Leaderboard /> : <Navigate to="/login" />} />
        </Routes>
      </main>
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