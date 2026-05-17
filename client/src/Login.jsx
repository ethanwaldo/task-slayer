import { useState } from "react";
import { post } from "./requests";
import loginBg from "./assets/login.webp";
import { GiCrossedSwords } from "react-icons/gi";

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
    <div id="login-main">
      <title>Task Slayer | Login</title>
      <div id="login-brand-panel" style={{ backgroundImage: `url(${loginBg})` }}>
        <div id="login-brand-overlay" />
        <div id="login-brand-content">
          <GiCrossedSwords id="login-logo" />
          <h1 id="login-heading">Task Slayer</h1>
          <p id="login-subheading">{isRegistering ? "Forge your destiny." : "Welcome back, slayer."}</p>
        </div>
      </div>

      <div id="login-form-panel">
        <div id="login-content">
          <div id="login-panel">
            <form onSubmit={handleSubmit} id="login-form">
              <div className="login-section">
                {error && <div id="login-error">{error}</div>}
                <input
                  type="text"
                  placeholder={isRegistering ? "Choose a Username" : "Username"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="login-input"
                  required
                />
                <input
                  type="password"
                  placeholder={isRegistering ? "Choose a Password" : "Password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  className="login-input"
                  required
                />
              </div>

              {isRegistering && (
                <div className="login-section">
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

              <div className="login-section login-section-last">
                <button type="submit" id="login-submit-btn">
                  {isRegistering ? "Create Account" : "Enter the Realm"}
                </button>
                <button type="button" onClick={() => setIsRegistering(!isRegistering)} id="login-toggle-text">
                  {isRegistering ? "Already have an account? Login here." : "New slayer? Register here."}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
