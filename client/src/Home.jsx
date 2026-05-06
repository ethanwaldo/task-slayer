import { useState, useEffect } from "react";
/** @import { Monster } from "./types" */

function Home() {
  const [task, setTask] = useState("");
  const [monsters, setMonsters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
      }
    } catch (e) {
      console.error("Failed to fetch profile", e);
    }
  }

  /** @type {React.SubmitEventHandler<HTMLFormElement>} */
  async function onSubmitTask(e) {
    e.preventDefault();
    if (task.trim().length === 0) return;
    setLoading(true);

    try {
      const res = await fetch("/api/summon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: task })
      });
      
      const data = await res.json();
      let id = monsters.length > 0 ? Math.max(...monsters.map(m => m.id)) + 1 : 0;

      setMonsters([
        ...monsters,
        {
          id,
          taskName: data.name,
          flavorText: data.flavorText,
          imageUrl: data.imageUrl,
          kind: data.type,
          primaryStat: data.primaryStat || "INT",
          task,
        }
      ]);
      setTask("");
    } catch (error) {
      console.error("Failed to summon monster:", error);
    } finally {
      setLoading(false);
    }
  }

  async function onSlay(monster) {
    try {
      const res = await fetch("/api/quest/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stat: monster.primaryStat })
      });
      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
      }
      setMonsters(monsters.filter(m => m.id !== monster.id));
    } catch (error) {
      console.error("Failed to slay monster:", error);
    }
  }

  /** @type {React.ChangeEventHandler<HTMLInputElement, HTMLInputElement>} */
  function onChangeTask(e) {
    setTask(e.target.value);
  }

  const level = profile ? Math.floor((profile.exp || 0) / 1000) + 1 : 1;
  const stats = profile?.stats || { STR: 10, INT: 10, AGI: 10, CON: 10, CHA: 10 };
  const maxStat = Math.max(...Object.values(stats), 20);

  return (
    <div className="quest-board">
      <title>Task Slayer - Quests</title>
      
      <div className="profile-header" style={{ flexDirection: "column", alignItems: "flex-start", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px", width: "100%" }}>
          <div className="avatar-ring">
            <span className="material-symbols-outlined text-primary text-4xl">shield</span>
          </div>
          <div className="profile-info" style={{ flex: 1 }}>
            <h2 style={{ fontSize: "1.5rem" }}>{profile?.displayName || "Guest"}</h2>
            <p style={{ color: "var(--color-primary)", fontWeight: "bold" }}>Level {level} {profile?.class_ || "Unselected"}</p>
            <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{profile?.exp || 0} XP</p>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", width: "100%", padding: "12px", background: "rgba(0,0,0,0.2)", borderRadius: "12px" }}>
          {Object.entries(stats).map(([statName, val]) => (
            <div key={statName} style={{ flex: "1 1 30%", minWidth: "120px", display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", fontWeight: "bold", color: "var(--color-text-muted)" }}>
                <span>{statName}</span>
                <span>{val}</span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "var(--color-border)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, (val / maxStat) * 100)}%`, height: "100%", background: "var(--color-primary)", borderRadius: "3px", transition: "width 0.5s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="quest-section">
        <div className="quest-section-header">
          <h3>Add New Quest</h3>
        </div>
        
        <form onSubmit={onSubmitTask} className="quest-input-form">
          <input
            className="quest-input"
            onChange={onChangeTask}
            value={task}
            placeholder="try: do the laundry"
            disabled={loading}
          />
          <button type="submit" className="quest-submit" disabled={loading}>
            {loading ? "Summoning..." : "Add"}
          </button>
        </form>

        <div className="quest-list">
          {monsters.length === 0 && !loading && (
            <p style={{ color: "var(--color-text-muted)", textAlign: "center" }}>No active quests. Add one above to begin your journey!</p>
          )}
          {loading && (
             <div className="quest-item" style={{ justifyContent: 'center', color: "var(--color-primary)" }}>
                <span className="material-symbols-outlined" style={{ animation: "spin 2s linear infinite" }}>autorenew</span>
                <span style={{ marginLeft: "8px", fontWeight: "bold" }}>The AI is summoning your monster...</span>
             </div>
          )}
          {monsters.map(m => {
            return (
              <div className="quest-item" key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '16px' }}>
                  {m.imageUrl ? (
                    <img src={m.imageUrl} alt={m.taskName} style={{ width: "64px", height: "64px", borderRadius: "12px", objectFit: "cover", border: "1px solid var(--color-border)" }} />
                  ) : (
                    <div className="quest-icon" style={{ width: "64px", height: "64px", flexShrink: 0, margin: 0 }}>
                      <span className="material-symbols-outlined">auto_stories</span>
                    </div>
                  )}
                  <div className="quest-details" style={{ flex: 1 }}>
                    <div className="quest-title" style={{ fontSize: "1.2rem", color: "var(--color-text)", display: "flex", alignItems: "center", gap: "8px" }}>
                      {m.taskName}
                      <span style={{ fontSize: "0.6rem", padding: "2px 6px", background: "var(--color-primary-dark)", color: "var(--color-primary)", borderRadius: "4px", textTransform: "uppercase" }}>{m.primaryStat}</span>
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", fontStyle: "italic", marginBottom: "4px" }}>"{m.flavorText}"</div>
                    <div className="quest-reward">+150 XP • <span style={{color: "var(--color-text-muted)"}}>{m.task}</span></div>
                  </div>
                </div>
                <button 
                  onClick={() => onSlay(m)}
                  style={{ background: "var(--color-primary)", color: "var(--color-bg)", border: "none", padding: "12px 24px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", marginLeft: "16px", textTransform: "uppercase", letterSpacing: "0.1em" }}
                >
                  Slay!
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;
