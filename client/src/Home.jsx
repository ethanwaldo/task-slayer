import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { monsterName, randomMonsterKind } from "./types";
import logo from "./assets/logo.png";
import MiniNav from "./MiniNav";
import Nav from "./Nav";
import Status from "./components/Status";
/** @import { Monster } from "./types" */

function Home({ loading, initialProfile }) {
  return (
    <>
      {initialProfile === null ?
        <HeroHome loading={loading} /> :
        <BattleHome initialProfile={initialProfile} />
      }
    </>
  );
}

function HeroHome({ loading }) {
  return (
    <>
      <title>Task Slayer</title>
      <Header />
      <Hero />
      <div className="flex flex-col items-center mt-15 w-full">
        <div className="home-monsters-container items-center">
          <h2 className="home-monsters-heading">What monsters will we slay today?</h2>
          {!loading && <LoginButtons />}
        </div>
      </div>
    </>
  );
}

function LoginButtons() {
  return (
    <div className="flex justify-center gap-x-2">
      <Link className="px-4 py-2 rounded text-white bg-blue-600" to="/login">Log in</Link>
      <Link className="px-4 py-2 rounded text-blue-500 border border-blue-500" to="/register">Sign up</Link>
    </div>
  );
}

function BattleHome({ initialProfile }) {
  const [task, setTask] = useState("");
  const [monsters, setMonsters] = useState(/** @type {Monster[]} */ ([]));
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [slayAlert, setSlayAlert] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchQuests();
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

  async function fetchQuests() {
    try {
      const res = await fetch("/api/quests");
      const data = await res.json();
      if (data.quests) {
        setMonsters(data.quests.map(q => ({
          id: q._id,
          taskName: q.monsterName,
          flavorText: q.flavorText,
          imageUrl: q.imageUrl,
          kind: q.type,
          primaryStat: q.primaryStat,
          task: q.description,
        })));
      }
    } catch (e) {
      console.error("Failed to fetch quests", e);
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
      if (!data.quest) {
        console.error("Summon failed:", data.error);
        return;
      }
      const q = data.quest;

      setMonsters([
        ...monsters,
        {
          id: q._id,
          taskName: q.monsterName,
          flavorText: q.flavorText,
          imageUrl: q.imageUrl,
          kind: q.type,
          primaryStat: q.primaryStat || "INT",
          task: q.description,
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
        body: JSON.stringify({ questId: monster.id })
      });
      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
      }
      setMonsters(monsters.filter(m => m.id !== monster.id));

      // show slay alert
      setSlayAlert({
        rating: data.slayRating,
        xp: data.xpEarned,
        coins: data.coinsEarned
      });
      setTimeout(() => setSlayAlert(null), 3000);
    } catch (error) {
      console.error("Failed to slay monster:", error);
    }
  }

  function revivePlayer() {
    // TODO
  }

  /** @type {React.ChangeEventHandler<HTMLInputElement, HTMLInputElement>} */
  function onChangeTask(e) {
    setTask(e.target.value);
  }
  return (
    <>
      <title>Task Slayer</title>
      <Header />

      {slayAlert && (
        <div className={`slay-alert slay-alert-${slayAlert.rating}`}>
          {slayAlert.rating === "critical" && "⚔️ "}
          {slayAlert.rating === "weak" && "💀 "}
          {slayAlert.rating === "normal" && "🗡️ "}
          <span style={{ textTransform: "capitalize" }}>{slayAlert.rating} Slay!</span>
          <div style={{ fontSize: "0.9rem", marginTop: "4px" }}>
            +{slayAlert.xp} XP • +{slayAlert.coins} Coins
          </div>
        </div>
      )}

      <div className="home-monsters-section mt-18 md:mt-10">
        <HeroLogo />
        <div className="home-monsters-container mt-12">
          <Status profile={profile} revive={revivePlayer} />
          <h2 className="home-monsters-heading mt-6">What monsters will we slay today?</h2>
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
                    onClick={() => onSlay(m)}
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

function Hero() {
  return (
    <div className="hero">
      <HeroLogo />
      <div className="hero-heading">Task Slayer</div>
      <div className="hero-subheading">Finish tasks. Slay monsters. Level up.</div>
    </div>
  );
}

function HeroLogo() {
  return (
    <img className="hero-logo" alt="logo" src={logo} />
  );
}

export default Home;
