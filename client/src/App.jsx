import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Shop from "./Shop";
import Leaderboard from "./Leaderboard";
import Login from "./Login";
import { get } from "./requests";
import "./global.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get("/api/profile")
      .then(data => {
        if (data.result === "success") setIsLoggedIn(true);
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/shop" element={<Shop />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
