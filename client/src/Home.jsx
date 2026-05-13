import { useState } from "react";
import { monsterName, randomMonsterKind } from "./types";
import logo from "./assets/logo.png";
import MiniNav from "./MiniNav";
import Nav from "./Nav";
/** @import { Monster } from "./types" */

function Home() {
  const [task, setTask] = useState("");
  const [monsters, setMonsters] = useState(/** @type {Monster[]} */ ([]));

  /** @type {React.SubmitEventHandler<HTMLFormElement>} */
  function onSubmitTask(e) {
    e.preventDefault();

    const words = task.trim().split(" ");
    if (words.length === 0) {
      return;
    }
    const lastWord = words[words.length - 1];
    if (lastWord.length === 0) {
      return;
    }
    const taskName = lastWord[0].toUpperCase() + lastWord.slice(1);

    let id = monsters.length;
    for (const m of monsters) {
      if (m.id >= id) {
        id = m.id + 1;
      }
    }

    let monsterKind = randomMonsterKind();
    for (let i = 0; i < 9; i++) {
      if (monsters.some(m => m.kind === monsterKind)) {
        monsterKind = randomMonsterKind();
      } else {
        break;
      }
    }
    setMonsters([
      ...monsters,
      {
        id,
        taskName,
        kind: monsterKind,
        maxHp: 10,
        currentHp: 0,
        task,
        level: 10
      }
    ]);
    setTask("");
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
            />
          </form>
          <div className="home-monsters">
            {monsters.map(m => {
              const name = monsterName(m);
              return (
                <div className="home-monster" key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{name} - {m.task}</span>
                  <button 
                    onClick={() => {
                      setMonsters(monsters.filter(monster => monster.id !== m.id));
                      fetch("/api/quest/complete", { method: "POST" })
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
