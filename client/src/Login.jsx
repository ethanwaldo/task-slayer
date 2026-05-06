import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [selectedClass, setSelectedClass] = useState("Scholar");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const classOptions = ["Scholar", "Warrior", "Bard", "Monk", "Rogue"];

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
    const body = isRegistering ? { username, class_: selectedClass } : { username };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Authentication failed");
        return;
      }

      onLogin(); // Tell App.jsx we're logged in
      navigate("/"); // Go to Quests board
    } catch (err) {
      setError("Network error");
    }
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "var(--color-bg)", color: "var(--color-text)", padding: "20px" }}>
      <title>{isRegistering ? "Register" : "Login"} - Task Slayer</title>
      <div style={{ background: "rgba(255,255,255,0.05)", padding: "40px", borderRadius: "16px", maxWidth: "400px", width: "100%", border: "1px solid var(--color-border)" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <span className="material-symbols-outlined text-primary text-6xl">swords</span>
          <h1 style={{ fontSize: "2rem", marginTop: "16px" }}>Task Slayer</h1>
          <p style={{ color: "var(--color-text-muted)" }}>{isRegistering ? "Forge your destiny." : "Welcome back, slayer."}</p>
        </div>

        {error && <div style={{ background: "rgba(255,0,0,0.1)", color: "red", padding: "12px", borderRadius: "8px", marginBottom: "16px", textAlign: "center" }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ padding: "16px", borderRadius: "8px", border: "1px solid var(--color-border)", background: "rgba(0,0,0,0.2)", color: "white", fontSize: "1.1rem" }}
            required
          />

          {isRegistering && (
            <div style={{ marginTop: "16px" }}>
              <p style={{ marginBottom: "8px", fontWeight: "bold", color: "var(--color-primary)" }}>Choose Your Archetype</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {classOptions.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedClass(c)}
                    style={{
                      flex: "1 1 30%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: `1px solid ${selectedClass === c ? "var(--color-primary)" : "var(--color-border)"}`,
                      background: selectedClass === c ? "rgba(255,215,0,0.1)" : "transparent",
                      color: selectedClass === c ? "var(--color-primary)" : "white",
                      cursor: "pointer",
                      fontWeight: "bold"
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: "12px", padding: "12px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", borderLeft: "3px solid var(--color-primary)" }}>
                <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
                  {selectedClass === "Scholar" && <span><strong>Scholar:</strong> Excels in mental tasks. +100% bonus to <strong>INT</strong> (Intelligence) gains.</span>}
                  {selectedClass === "Warrior" && <span><strong>Warrior:</strong> Excels in physical labor. +100% bonus to <strong>STR</strong> (Strength) gains.</span>}
                  {selectedClass === "Bard" && <span><strong>Bard:</strong> Excels in social interactions. +100% bonus to <strong>CHA</strong> (Charisma) gains.</span>}
                  {selectedClass === "Monk" && <span><strong>Monk:</strong> Excels in habits and endurance. +100% bonus to <strong>CON</strong> (Constitution) gains.</span>}
                  {selectedClass === "Rogue" && <span><strong>Rogue:</strong> Excels in speed and errands. +100% bonus to <strong>AGI</strong> (Agility) gains.</span>}
                </p>
              </div>
            </div>
          )}

          <button type="submit" style={{ padding: "16px", borderRadius: "8px", background: "var(--color-primary)", color: "var(--color-bg)", fontSize: "1.2rem", fontWeight: "bold", border: "none", cursor: "pointer", marginTop: "16px" }}>
            {isRegistering ? "Create Account" : "Enter the Realm"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", color: "var(--color-text-muted)", cursor: "pointer" }} onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Already have an account? Login here." : "New slayer? Register here."}
        </p>
      </div>
    </div>
  );
}

export default Login;
