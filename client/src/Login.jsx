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
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-[rgba(255,255,255,0.05)] pt-32 sm:pt-12 pb-12 flex flex-col w-full items-center min-h-screen sm:min-h-fit sm:max-w-100 sm:rounded-2xl sm:mt-12 sm:mb-12 sm:border sm:border-border">
        <title>{isRegistering ? "Register" : "Login"} - Task Slayer</title>
        <span className="material-symbols-outlined text-primary text-5xl!">swords</span>
        <h1 className="text-4xl font-bold mt-3">Task Slayer</h1>
        <div className="text-gray-400 mt-3">{isRegistering ? "Forge your destiny." : "Welcome back, slayer."}</div>
        <form className="flex flex-col gap-4 mt-4 px-8 items-center w-full max-w-100" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 text-lg rounded-lg border border-border bg-[rgba(0,0,0,0.2)] text-white placeholder:text-gray-400"
            required
          />
          {isRegistering && (
            <>
              <div className="text-primary font-bold mt-6">Choose your class</div>
              <div className="flex flex-wrap gap-2">
                {classOptions.map(c => (
                  <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedClass(c)}
                      className="py-2"
                      style={{
                        flex: "1 1 30%",
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
              <div className="w-full" style={{ marginTop: "12px", padding: "12px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", borderLeft: "3px solid var(--color-primary)" }}>
                <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
                  {selectedClass === "Scholar" && <span><strong>Scholar:</strong> Excels in mental tasks. <br /> +100% bonus to <strong>INT</strong> (Intelligence) gains.</span>}
                  {selectedClass === "Warrior" && <span><strong>Warrior:</strong> Excels in physical labor. <br /> +100% bonus to <strong>STR</strong> (Strength) gains.</span>}
                  {selectedClass === "Bard" && <span><strong>Bard:</strong> Excels in social interactions. <br /> +100% bonus to <strong>CHA</strong> (Charisma) gains.</span>}
                  {selectedClass === "Monk" && <span><strong>Monk:</strong> Excels in habits and endurance. <br /> +100% bonus to <strong>CON</strong> (Constitution) gains.</span>}
                  {selectedClass === "Rogue" && <span><strong>Rogue:</strong> Excels in speed and errands. <br /> +100% bonus to <strong>AGI</strong> (Agility) gains.</span>}
                </p>
              </div>
            </>
          )}
          <button type="submit" className="w-full py-3 rounded-lg bg-primary text-bg text-lg font-bold cursor-pointer mt-4">
            {isRegistering ? "Create Account" : "Enter the Realm"}
          </button>
        </form>
        <div className="text-center mt-6 text-gray-400 cursor-pointer" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Already have an account? Login here." : "New slayer? Register here."}
        </div>
      </div>
    </div>
  );
}

export default Login;
