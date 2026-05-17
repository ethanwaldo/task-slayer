import { useState } from "react";
import dayjs from "dayjs";
import { GiCrossedSwords, GiSkullCrossedBones, GiBroadsword } from "react-icons/gi";

export function parseMonster(data) {
  return {
    id: data._id,
    taskName: data.monsterName,
    flavorText: data.flavorText,
    imageUrl: data.imageUrl,
    kind: data.type,
    primaryStat: data.primaryStat || "INT",
    task: data.description,
    deadline: data.deadline || null,
    missedDeadline: data.missedDeadline || false,
  };
}

export function getJustMissedDeadlines(monsters, now) {
  return monsters
    .filter(m => m.deadline && !m.missedDeadline && dayjs(now).isAfter(dayjs(m.deadline)))
    .map(m => m.id);
}

const SLAY_ICONS = {
  critical: <GiCrossedSwords />,
  normal:   <GiBroadsword />,
  weak:     <GiSkullCrossedBones />,
};

export function Monster({ monster, onSlay, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);

  if (monster.slayAlert) {
    const { rating, xp, coins } = monster.slayAlert;
    return (
      <div className={`home-monster home-monster-slain slay-alert-${rating}`}>
        <div className="slay-alert-icon">{SLAY_ICONS[rating]}</div>
        <div className="slay-alert-title">{rating} Slay!</div>
        <div className="slay-alert-rewards">+{xp} XP • +{coins} Coins</div>
      </div>
    );
  }

  return (
    <div className="monster-wrapper">
      <MonsterView monster={monster} onSlay={onSlay} onEdit={() => setEditing(true)} onDelete={onDelete} />
      {editing && (
        <MonsterEdit monster={monster} onUpdate={onUpdate} onDelete={onDelete} onDone={() => setEditing(false)} />
      )}
    </div>
  );
}

function MonsterImage({ monster }) {
  return monster.imageUrl
    ? <img src={monster.imageUrl} alt={monster.taskName} className="monster-image" />
    : <div className="monster-image-placeholder" />;
}

function MonsterView({ monster, onSlay, onEdit, onDelete }) {
  return (
    <div className="home-monster">
      <div className="monster-left">
        <MonsterImage monster={monster} />
        <div className="monster-identity">
          <div className="monster-name">{monster.taskName}</div>
          <span className="monster-stat-badge">{monster.primaryStat || monster.kind}</span>
        </div>
        <div className="monster-details">
          {monster.flavorText && <div className="monster-flavor">"{monster.flavorText}"</div>}
          <div className="monster-task">Task: {monster.task}</div>
          {monster.deadline && (
            <div className="monster-deadline">
              Deadline: {dayjs(monster.deadline).format("MMM D, YYYY h:mm A")}
            </div>
          )}
          {monster.missedDeadline && <div className="monster-missed">Deadline missed! −1 HP</div>}
        </div>
      </div>
      <div className="monster-actions">
        <button className="monster-edit-btn" onClick={onEdit}>Set Deadline</button>
        <button className="monster-remove-btn" onClick={() => onDelete(monster)}>Remove</button>
        <button className="home-slay-button" onClick={() => onSlay(monster)}>Slay</button>
      </div>
    </div>
  );
}

function MonsterEdit({ monster, onUpdate, onDelete, onDone }) {
  const [localDeadline, setLocalDeadline] = useState(
    monster.deadline ? dayjs(monster.deadline).format("YYYY-MM-DDTHH:mm") : ""
  );
  const [error, setError] = useState("");

  function onChange(e) {
    const val = e.target.value;
    setLocalDeadline(val);
    if (!val) { setError(""); return; }
    const date = new Date(val);
    if (dayjs(date).isBefore(dayjs())) { setError("Deadline is in the past"); return; }
    setError("");
    onUpdate({ ...monster, deadline: date });
  }

  return (
    <div className="home-monster monster-edit-overlay">
      <div className="monster-left">
        <MonsterImage monster={monster} />
        <div className="monster-identity">
          <div className="monster-name">{monster.taskName}</div>
          <span className="monster-stat-badge">{monster.primaryStat || monster.kind}</span>
        </div>
        <div className="monster-details">
          <div className="monster-deadline-form">
            <label className="monster-deadline-label">DEADLINE</label>
            <input
              type="datetime-local"
              className="monster-deadline-input"
              value={localDeadline}
              onChange={onChange}
            />
            {error && <div className="monster-deadline-error">{error}</div>}
          </div>
        </div>
      </div>
      <div className="monster-actions">
        <button className="monster-edit-btn" onClick={onDone}>Confirm Deadline</button>
        <button className="monster-remove-btn" onClick={() => onDelete(monster)}>Remove</button>
      </div>
    </div>
  );
}
