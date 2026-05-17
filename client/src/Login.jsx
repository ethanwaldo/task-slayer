import { useState } from "react";
import { post } from "./requests";

const CLASS_OPTIONS = ["Scholar", "Warrior", "Bard", "Monk", "Rogue"];

function Login({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedClass, setSelectedClass] = useState("Scholar");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
    const body = isRegistering
      ? { username, password, class_: selectedClass }
      : { username, password };

    try {
      const data = await post(endpoint, body);
      if (data.error) {
        setError(data.error);
        return;
      }
      onLogin();
    } catch {
      setError("Network error");
    }
  }

  return (
    <div id="login-page">
      <div id="login-hero">
        <h1 id="login-heading">Task Slayer</h1>
        <p id="login-subheading">{isRegistering ? "Forge your destiny." : "Welcome back, slayer."}</p>
      </div>

      <div id="login-panel">
        {error && <div id="login-error">{error}</div>}

        <form onSubmit={handleSubmit} id="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            className="login-input"
            required
          />

          {isRegistering && (
            <div id="login-archetype-container">
              <p id="login-archetype-heading">Choose Your Archetype</p>
              <div id="login-archetype-grid">
                {CLASS_OPTIONS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedClass(c)}
                    className={`login-archetype-btn ${selectedClass === c ? "login-archetype-btn-active" : "login-archetype-btn-inactive"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button type="submit" id="login-submit-btn">
            {isRegistering ? "Create Account" : "Enter the Realm"}
          </button>
        </form>

        <button onClick={() => setIsRegistering(!isRegistering)} id="login-toggle-text">
          {isRegistering ? "Already have an account? Login here." : "New slayer? Register here."}
        </button>
      </div>
    </div>
  );
}

export default Login;
