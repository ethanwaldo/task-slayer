import { useState } from "react";
import "./App.css"
import Leaderboard from "./components/Leaderboard";

function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="app">
      <nav className="navbar">
        <button onClick={() => setPage("Home")}>Home</button>
        <button onClick={() => setPage("Leaderboard")}>Leaderboard</button>
      </nav>

      {page === "Home" && (
        <main className="page">
          <h1>Task Slayer</h1>
          <p>Homepage coming soon!</p>
        </main>
      )}

      {page === "Leaderboard" && (
        <main className="page">
          <Leaderboard />
        </main>
      )}
    </div>
  );
}

export default App; 