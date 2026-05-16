import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import ClassPage from "./ClassPage";
import Home from "./Home";
import Leaderboard from "./components/Leaderboard";
import Login from "./Login";
import "./global.css";
import Shop from "./Shop";

function InsideRouter() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/profile")
      .then(res => res.json())
      .then(data => {
        if (data.result === "success" && data.profile.displayName !== "Guest Slayer") {
          setProfile(data.profile);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;

  function onLogin(profile) {
    setProfile(profile);
    navigate("/");
  }

  return (
    <Routes>
      <Route path="/" element={<Home loading={loading} initialProfile={profile} />} />
      <Route path="/login" element={<Login onLogin={onLogin} isRegistering={false} />} /> 
      <Route path="/register" element={<Login onLogin={onLogin} isRegistering={true} />} /> 
      <Route path="/class" element={<ClassPage />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
    </Routes>
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