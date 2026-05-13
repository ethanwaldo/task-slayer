import { useState } from "react";
import { monsterName, randomMonsterKind } from "./types";
import logo from "./assets/logo.png";
import MiniNav from "./MiniNav";
import Nav from "./Nav";
/** @import { Monster } from "./types" */

function Home() {
  const [task, setTask] = useState("");
  const [monsters, setMonsters] = useState(/** @type {Monster[]} */ ([]));
  const [loading, setLoading] = useState(false);

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
          primaryStat: data.primaryStat || "INT",
          kind: data.type || "Anomaly",
          task: task,
          level: 1,
          currentHp: 10,
          maxHp: 10
        }
      ]);
      setTask("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }
  /** @type {React.ChangeEventHandler<HTMLInputElement, HTMLInputElement>} */
  function onChangeTask(e) {
    setTask(e.target.value);
  }
  return (
    <>
      <title>Task Slayer</title>
      <Header />
      <div className="hero">
        <img className="hero-logo" alt="logo" src={logo} />
        <div className="hero-heading">Task Slayer</div>
        <div className="hero-subheading">Finish tasks. Slay monsters. Level up.</div>
      </div>
      <div className="home-monsters-section">
        <div className="home-monsters-container">
          <h2 className="home-monsters-heading">What monsters will we slay today?</h2>
          <form onSubmit={onSubmitTask}>
            <input
              className="home-monsters-input"
              onChange={onChangeTask}
              value={task}
              placeholder="try: do the laundry"
              disabled={loading}
            />
          </form>
          {loading && <div style={{ color: "var(--color-primary)", marginTop: "12px", textAlign: "center", fontWeight: "bold" }}>Summoning AI Monster...</div>}
          <div className="home-monsters">
            {monsters.map(m => {
              return (
                <div className="home-monster" key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
                    {m.imageUrl ? (
                      <img src={m.imageUrl} alt={m.taskName} style={{ width: "64px", height: "64px", borderRadius: "8px", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "64px", height: "64px", background: "rgba(0,0,0,0.2)", borderRadius: "8px" }} />
                    )}
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{m.taskName} <span style={{ fontSize: "0.7rem", padding: "2px 4px", background: "rgba(0,0,0,0.2)", borderRadius: "4px" }}>{m.primaryStat || m.kind}</span></div>
                      {m.flavorText && <div style={{ fontSize: "0.85rem", fontStyle: "italic", opacity: 0.8 }}>"{m.flavorText}"</div>}
                      <div style={{ fontSize: "0.9rem" }}>Task: {m.task}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setMonsters(monsters.filter(monster => monster.id !== m.id));
                      fetch("/api/quest/complete", { 
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ stat: m.primaryStat })
                      })
                        .then(res => res.json())
                        .then(data => {
                          if (data.result === "success") {
                            console.log(`Slayed! Earned 150 EXP and +${data.amount} ${data.statGained}`);
                          }
                        });
                    }}
                    className="home-slay-button"
                  >
                    Slay
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function Header() {
  return (
    <>
      <header className="home-header">
        <Nav />
      </header>
      <header className="home-mini-header">
        <MiniNav />
      </header>
    </>
  );
}

export default Home;
