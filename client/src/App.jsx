import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClassPage from "./ClassPage";
import Home from "./Home";
import Leaderboard from "./components/Leaderboard";
import Login from "./Login";
import "./global.css";

function InsideRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/class" element={<ClassPage />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
    </Routes>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then(res => res.json())
      .then(data => {
        if (data.result === "success" && data.profile.displayName !== "Guest Slayer") {
          setIsLoggedIn(true);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <Router>
      {!isLoggedIn ? (
        <Login onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <InsideRouter />
      )}
    </Router>
  );
}

export default App;