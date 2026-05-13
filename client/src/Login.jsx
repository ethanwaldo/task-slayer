import { useState } from "react";

function Login({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [selectedClass, setSelectedClass] = useState("Scholar");
  const [error, setError] = useState("");

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
    } catch (err) {
      setError("Network error");
    }
  }

  return (
    <div className="login-page">
      
      <div className="login-hero">
        <h1 className="login-heading">Task Slayer</h1>
        <p className="login-subheading">{isRegistering ? "Forge your destiny." : "Welcome back, slayer."}</p>
      </div>

      <div className="login-panel">
        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
            required
          />

          {isRegistering && (
            <div className="login-archetype-container">
              <p className="login-archetype-heading">Choose Your Archetype</p>
              <div className="login-archetype-grid">
                {classOptions.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedClass(c)}
                    className={selectedClass === c ? "login-archetype-btn login-archetype-btn-active" : "login-archetype-btn login-archetype-btn-inactive"}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button type="submit" className="login-submit-btn">
            {isRegistering ? "Create Account" : "Enter the Realm"}
          </button>
        </form>

        <p 
          onClick={() => setIsRegistering(!isRegistering)}
          className="login-toggle-text"
        >
          {isRegistering ? "Already have an account? Login here." : "New slayer? Register here."}
        </p>
      </div>
    </div>
  );
}

export default Login;
