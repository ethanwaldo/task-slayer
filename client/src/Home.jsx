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
    <div className="flex justify-center">
      <div className="px-5 py-12 flex flex-col items-center w-full max-w-160">
        <title>Task Slayer - Quests</title>
        <div className="flex items-center gap-6 w-full">
          <div className="avatar-ring">
            <span className="material-symbols-outlined text-primary text-4xl">shield</span>
          </div>
          <div className="profile-info" style={{ flex: 1 }}>
            <h2 className="text-2xl">{profile?.displayName || "Guest"}</h2>
            <div className="text-primary font-bold">Level {level} {profile?.class_ || "Unselected"}</div>
            <p className="text-[0.8rem] text-text-muted" style={{ color: "var(--color-text-muted)" }}>{profile?.exp || 0} XP</p>
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
        <div className="w-full bg-surface border border-border rounded-3xl p-6 mt-6"
          style={{   
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)"
          }}
        >
          <h3 className="font-bold text-xl">Add New Quest</h3>
          <form className="flex items-center justify-end flex-wrap gap-3 mt-4" onSubmit={onSubmitTask}>
            <input
              className="flex-1 bg-[rgba(0,0,0,0.3)] border border-border rounded-2xl px-4 py-1 text-white outline-none transition-all-02 focus:border-primary focus-box-shadow:focus"
              onChange={onChangeTask}
              value={task}
              placeholder="try: do the laundry"
              disabled={loading}
            />
            <button type="submit" className="bg-primary text-bg rounded-2xl px-6 py-1 font-bold cursor-pointer transition-all-02" disabled={loading}>
              Add
            </button>
          </form>

          <div className="flex flex-col gap-3 mt-6">
            {monsters.length === 0 && !loading && (
              <div className="text-text-muted text-center">No active quests.</div>
            )}
            {loading && (
              <div className="text-lg flex items-center justify-center p-4 bg-card border border-border rounded-2xl text-primary">
                  <span className="material-symbols-outlined" style={{ animation: "spin 2s linear infinite" }}>autorenew</span>
                  <span className="ml-2 font-bold">Summoning...</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-y-4">
            {monsters.map(m => {
              return (
                <div className="flex flex-wrap gap-y-4 items-center justify-end p-4 bg-card border border-border rounded-2xl transition-all-02 hover:border-[rgb(43,238,121,0.4)] hover:bg-[rgba(255,255,255,0.05)]" key={m.id}>
                  <div className="flex items-start flex-1 gap-4">
                    {m.imageUrl ? (
                      <img className="w-16 h-16 rounded-xl object-cover border border-border" src={m.imageUrl} alt={m.taskName} />
                    ) : (
                      <div className="quest-icon" style={{ width: "64px", height: "64px", flexShrink: 0, margin: 0 }}>
                        <span className="material-symbols-outlined">auto_stories</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-bold text-[1.2rem] text-white flex items-center gap-2">
                        {m.taskName}
                        <span className="text-[0.6rem] px-0.5 py-1.5 text-primary rounded-sm uppercase">{m.primaryStat}</span>
                      </div>
                      <div className="text-[0.85rem] text-text-muted italic mb-1">"{m.flavorText}"</div>
                      <div className="text-primary text-[0.9rem] font-bold">+150 XP • <span className="text-text-muted">{m.task}</span></div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onSlay(m)}
                    className="bg-primary text-bg py-3 px-6 sm:w-fit rounded-lg font-bold cursor-pointer uppercase tracking-widest"
                  >
                    Slay!
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
