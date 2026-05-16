import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { MdCheck, MdDelete } from "react-icons/md";
import { monsterName, randomMonsterKind } from "./types";
import logo from "./assets/logo.png";
import MiniNav from "./components/MiniNav";
import Nav from "./components/Nav";
import Status from "./components/Status";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { patch, post } from "./requests";
/** @import { Monster } from "./types" */

function HomeFacade({ loading, initialProfile }) {
  const [coords, setCoords] = useState(null);
  const [coordList, setCoordList] = useState([]);
  const [time, setTime] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 1000/60);
    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    if (coords !== null) {
      setCoordList([...coordList, coords]);
      console.log(coords);
    }
  }, [time]);
  function onMove(e) {
    const coords = [e.clientX, e.clientY];
    setCoords(coords);
  }
  return (
    <>
      {coords && (
          <div
            className="absolute -z-10 bg-blue-400 w-16 h-16 -translate-1/2 rounded-full bg-radial from-sky-300 to-sky-100"
            style={{ left: coords[0], top: coords[1] }}
          ></div>
        )}
      <Home loading={loading} initialProfile={initialProfile} />
      <div className="absolute top-0 left-0 w-full h-full" onMouseMove={onMove}></div>
    </>
  );
}

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
  const [date, setDate] = useState(Date.now());

  useEffect(() => {
    fetchProfile();
    fetchQuests();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.profile) {
        data.profile.hp = (typeof data.profile.hp === "number") ? data.profile.hp : 10; // TODO: remove
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
        const monsters = data.quests.map(parseMonster);
        setMonsters(monsters);
        const missedDeadlines = getJustMissedDeadlines(monsters, new Date());
        const hpLost = missedDeadlines.length;
        await handleMissedDeadlines(profile.hp, monsters, missedDeadlines);
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
        parseMonster(q)
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

  /** @type {React.ChangeEventHandler<HTMLInputElement, HTMLInputElement>} */
  function onChangeTask(e) {
    setTask(e.target.value);
  }

  async function updateMonster(monster) {
    await patch("/api/quest", { id: monster.id, deadline: monster.deadline });
    const newMonsters = monsters.map(existing => {
      if (existing.id === monster.id) {
        return {
          ...existing,
          deadline: monster.deadline,
          missedDeadline: false,
        };
      } else {
        return existing;
      }
    });
    setMonsters(newMonsters);
  }

  async function deleteMonster(monster) {
    await fetch(`/api/quest/${monster.id}`, {
      method: "DELETE"
    });
    const newMonsters = monsters.filter(existing => existing.id !== monster.id);
    setMonsters(newMonsters);
  }

  async function handleMissedDeadlines(hp, monsters, missedDeadlines) {
    if (missedDeadlines.length === 0) return;
    const hpLost = missedDeadlines.length;
    const newHp = Math.max(hp - hpLost, 0);
    const newMonsters = monsters.map(m => {
      if (missedDeadlines.includes(m.id)) {
        return {
          ...m,
          missedDeadline: true,
        };
      } else {
        return m;
      }
    });
    await post("/api/tick", {
      hp: newHp,
      missedDeadlines,
    });
    setProfile({
      ...profile,
      hp: newHp,
    });
    setMonsters(newMonsters);
  }

  async function tick(missedDeadlines) {
    await handleMissedDeadlines(profile.hp, monsters, missedDeadlines);
    // if (missedDeadlines.length === 0) return false;
    // const hpLost = missedDeadlines.length;
    // const newHp = Math.max(profile.hp - hpLost, 0);
    // const newMonsters = monsters.map(m => {
    //   if (missedDeadlines.includes(m.id)) {
    //     return {
    //       ...m,
    //       missedDeadline: true,
    //     };
    //   } else {
    //     return m;
    //   }
    // });
    // await post("/api/tick", {
    //   hp: newHp,
    //   missedDeadlines,
    // });
    // setProfile({
    //   ...profile,
    //   hp: newHp,
    // });
    // setMonsters(newMonsters);
    // return true;
  }

  const props = {
    onSlay,
    updateMonster,
    deleteMonster,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 67);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // let changed = false;
    // let hpLost = 0;
    // function attackPlayer() {
    //   hpLost++;
    // }
    const missedDeadlines = getJustMissedDeadlines(monsters, date);
    // const hpLost = missedDeadlines.length;
    // const missedDeadlines = monsters.flatMap(m => {
    //   if (justMissedDeadline(m, date)) {
    //     hpLost++;
    //     return [m.id];
    //   } else {
    //     return [];
    //   }
    // });
    // const newMonsters = monsters.list.map(existing => {
    //   const newMonster = justMissedDeadline(existing, time, attackPlayer);
    //   if (newMonster !== existing) {
    //     changed = true;
    //   }
    //   return newMonster;
    // });
    tick(missedDeadlines);
  }, [date]);

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
          <Status profile={profile} />
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
                <Monster key={m.id} props={props} monster={m} />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function Monster({ props, monster }) {
  const [editing, setEditing] = useState(false);
  function switchToEdit() {
    setEditing(true);
  }
  function switchToView() {
    setEditing(false);
  }
  return editing ?
    <MonsterEdit props={props} monster={monster} switchToView={switchToView} /> :
    <MonsterView props={props} monster={monster} switchToEdit={switchToEdit} />
}

function MonsterEdit({ props, monster, switchToView }) {
  const [userSelectedDeadline, setUserSelectedDeadline] = useState(null);
  function deleteMonster() {
    monsters.deleteMonster(monster);
  }
  function onChangeDeadline(e) {
    const formatted = e.target.value;
    const date = new Date(e.target.value);
    setUserSelectedDeadline(date);
    if (dayjs(date).isBefore(dayjs())) return;
    props.updateMonster({
      ...monster,
      deadline: date,
    });
    setUserSelectedDeadline(null);
  }
  const deadline = userSelectedDeadline || monster.deadline || null;
  const formattedDeadline = deadline ? dayjs(deadline).format("YYYY-MM-DDTHH:mm:ss") : "";
  const isInPast = userSelectedDeadline && dayjs(userSelectedDeadline).isBefore(dayjs());
  return (
    <div className="flex flex-col items-start gap-y-2 font-sans p-2 bg-slate-700 rounded-sm text-slate-100" key={monster.id}>
      <div className="w-full flex items-start justify-between">
        <div>{monster.taskName}</div>
        <div className="flex gap-x-3">
          <button onClick={deleteMonster} className="cursor-pointer">
            <RiDeleteBin6Line className="text-xl text-slate-400" />
          </button>
          <button onClick={switchToView} className="cursor-pointer">
            <MdCheck className="text-xl text-slate-400" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-y-0.5">
        <input type="datetime-local" name="deadline" onChange={onChangeDeadline} value={formattedDeadline} className="bg-slate-600 rounded-sm px-1 py-0.5" />
        <label className="ml-2 text-slate-400 font-bold text-sm" htmlFor='deadline'>DEADLINE</label>
        {isInPast && <div className="text-red-400">Deadline is in the past</div>}
      </div>
    </div>
  );
}

function MonsterView({ props, monster, switchToEdit }) {
  function onSlay() {
    props.onSlay(monster);
  }
  return (
    <div className="home-monster" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
        {monster.imageUrl ? (
          <img src={monster.imageUrl} alt={monster.taskName} style={{ width: "64px", height: "64px", borderRadius: "8px", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "64px", height: "64px", background: "rgba(0,0,0,0.2)", borderRadius: "8px" }} />
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{monster.taskName} <span style={{ fontSize: "0.7rem", padding: "2px 4px", background: "rgba(0,0,0,0.2)", borderRadius: "4px" }}>{monster.primaryStat || monster.kind}</span></div>
          {monster.flavorText && <div style={{ fontSize: "0.85rem", fontStyle: "italic", opacity: 0.8 }}>"{monster.flavorText}"</div>}
          <div style={{ fontSize: "0.9rem" }}>Task: {monster.task}</div>
          {monster.deadline !== null && (
            <div className="text-[0.9rem]">{dayjs(monster.deadline).format("M-D-YY h:mm A")}</div>
          )}
          {monster.missedDeadline && (
            <div className="text-red-400">Missed</div>
          )}
        </div>
      </div>
      <div className="grid h-full" style={{ gridTemplateRows: "1fr 1fr 1fr" }}>
        <div className="flex items-start justify-end">
          <button className=" text-slate-400 text-lg cursor-pointer" onClick={switchToEdit}>
            <FaEdit />
          </button>
        </div>
        <button 
          onClick={onSlay}
          className="home-slay-button"
        >
          Slay
        </button>
      </div>
    </div>
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

function parseMonster(data) {
  return {
    id: data._id,
    taskName: data.monsterName,
    flavorText: data.flavorText,
    imageUrl: data.imageUrl,
    kind: data.type,
    primaryStat: data.primaryStat || "INT",
    task: data.description,
    deadline: data.deadline || null, // TODO: remove
    missedDeadline: data.missedDeadline || false // TODO: remove
  };
}

function getJustMissedDeadlines(monsters, date) {
  return monsters.flatMap(m => {
    if (justMissedDeadline(m, date)) {
      return [m.id];
    } else {
      return [];
    }
  });
}

function justMissedDeadline(monster, date) {
  if (monster.deadline === null) return false;
  if (dayjs(date).isBefore(dayjs(monster.deadline))) return false;
  if (monster.currentHp === 0) {
    return false;
  } else {
    if (monster.missedDeadline) {
      return false;
    } else {
      return true;
    }
  }
}

export default Home;
