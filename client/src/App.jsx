import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClassPage from "./ClassPage";
import Home from "./Home";
import Leaderboard from "./components/Leaderboard";
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
  return (
    <Router>
      <InsideRouter />
    </Router>
  );
}

export default App;