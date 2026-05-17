import { useState, useEffect } from "react";
import PageHeader from "./components/PageHeader";
import Status from "./components/Status";
import { Monster, parseMonster, getJustMissedDeadlines } from "./components/Monster";
import { get, post, patch, del } from "./requests";
import warriorImage from "./assets/warrior.webp";
import scholarImage from "./assets/scholar.png";
import bardImage from "./assets/bard.webp";
import monkImage from "./assets/monk.jpg";
import rogueImage from "./assets/rogue.png";

const CLASS_IMAGES = {
  Warrior: warriorImage,
  Scholar: scholarImage,
  Bard: bardImage,
  Monk: monkImage,
  Rogue: rogueImage,
};

function Home() {
  const [task, setTask] = useState("");
  const [monsters, setMonsters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summonError, setSummonError] = useState("");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchQuests();
  }, []);

  async function fetchProfile() {
    try {
      const data = await get("/api/profile");
      if (data.profile) setProfile(data.profile);
    } catch (e) {
      console.error("Failed to fetch profile", e);
    }
  }

  async function fetchQuests() {
    try {
      const data = await get("/api/quests");
      if (data.quests) {
        const parsed = data.quests.map(parseMonster);
        setMonsters(parsed);
        const missed = getJustMissedDeadlines(parsed, new Date());
        if (missed.length > 0) await handleMissedDeadlines(parsed, missed);
      }
    } catch (e) {
      console.error("Failed to fetch quests", e);
    }
  }

  async function handleMissedDeadlines(currentMonsters, missedIds) {
    setProfile(prev => {
      if (!prev) return prev;
      const newHp = Math.max((prev.hp ?? 10) - missedIds.length, 0);
      post("/api/tick", { hp: newHp, missedDeadlines: missedIds });
      return { ...prev, hp: newHp };
    });
    setMonsters(currentMonsters.map(m =>
      missedIds.includes(m.id) ? { ...m, missedDeadline: true } : m
    ));
  }

  async function onSubmitTask(e) {
    e.preventDefault();
    if (task.trim().length === 0) return;
    setLoading(true);
    setSummonError("");
    try {
      const data = await post("/api/summon", { task });
      if (!data.quest) { setSummonError(data.error || "Failed to summon monster"); return; }
      setMonsters(prev => [...prev, parseMonster(data.quest)]);
      setTask("");
    } catch (error) {
      setSummonError("Could not reach server");
    } finally {
      setLoading(false);
    }
  }

  async function onSlay(monster) {
    try {
      const data = await post("/api/quest/complete", { questId: monster.id });
      if (data.profile) setProfile(data.profile);
      setMonsters(prev => prev.map(m =>
        m.id === monster.id
          ? { ...m, slayAlert: { rating: data.slayRating, xp: data.xpEarned, coins: data.coinsEarned } }
          : m
      ));
      setTimeout(() => {
        setMonsters(prev => prev.filter(m => m.id !== monster.id));
      }, 1500);
    } catch (error) {
      console.error("Failed to slay monster:", error);
    }
  }

  async function updateMonster(monster) {
    await patch("/api/quest", { id: monster.id, deadline: monster.deadline });
    setMonsters(prev => prev.map(m => m.id === monster.id ? { ...monster, missedDeadline: false } : m));
  }

  async function deleteMonster(monster) {
    await del(`/api/quest/${monster.id}`);
    setMonsters(prev => prev.filter(m => m.id !== monster.id));
  }

  return (
    <>
      <title>Task Slayer</title>
      <PageHeader />
      <div id="home-main">
        <div
          id="home-brand-panel"
          style={CLASS_IMAGES[profile?.class_] ? { backgroundImage: `url(${CLASS_IMAGES[profile.class_]})` } : undefined}
        >
          <div id="home-brand-overlay" />
          <div id="home-brand-footer">
            <div id="home-brand-title">Welcome back, {profile?.displayName}</div>
            <div id="home-brand-sub">Finish tasks. Slay monsters. Level up.</div>
          </div>
        </div>
        <div id="home-task-panel">
          <div className="home-section">
            {profile && <Status profile={profile} />}
          </div>
          <div className="home-section">
            <h2 id="home-monsters-heading">What monsters will we slay today?</h2>
            <form onSubmit={onSubmitTask}>
              <input
                id="home-monsters-input"
                onChange={e => setTask(e.target.value)}
                value={loading ? "" : task}
                placeholder={loading ? "Summoning AI Monster..." : "try: do the laundry"}
                disabled={loading}
              />
              {summonError && <div id="home-summon-error">{summonError}</div>}
            </form>
          </div>
          <div className="home-section" id="home-section-monsters">
            <div id="home-monsters">
              {monsters.map(m => (
                <Monster
                  key={m.id}
                  monster={m}
                  onSlay={onSlay}
                  onUpdate={updateMonster}
                  onDelete={deleteMonster}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
