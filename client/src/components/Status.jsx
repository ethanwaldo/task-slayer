import { FaHeart } from "react-icons/fa";
import { GiCrownCoin } from "react-icons/gi";

function levelFromXp(xp) {
  return Math.floor((xp || 0) / 1000) + 1;
}

function xpFromLevel(level) {
  return (level - 1) * 1000;
}

export default function Status({ profile }) {
  const level = levelFromXp(profile.exp);
  const maxHp = 10 + level - 1;
  const hp = typeof profile.hp === "number" ? profile.hp : maxHp;
  const xpInBar = (profile.exp || 0) - xpFromLevel(level);
  const xpBarSize = xpFromLevel(level + 1) - xpFromLevel(level);
  const pHp = Math.min((hp / maxHp) * 100, 100);
  const pXp = Math.min((xpInBar / xpBarSize) * 100, 100);

  return (
    <div id="status">
      {hp === 0 && <div id="status-dead">You are dead!</div>}
      <div id="status-hud">
        <div className="status-row">
          <span className="status-icon" id="status-hp-icon"><FaHeart /></span>
          <div className="status-bar-wrapper">
            <div className="status-bar-track">
              <div className="status-bar" id="status-hp-bar" style={{ width: `${pHp}%` }} />
            </div>
            <span className="status-label">{Math.round(hp)}/{maxHp}</span>
          </div>
        </div>
        <div className="status-divider" />
        <div className="status-row">
          <span className="status-icon" id="status-xp-icon">{level}</span>
          <div className="status-bar-wrapper">
            <div className="status-bar-track">
              <div className="status-bar" id="status-xp-bar" style={{ width: `${pXp}%` }} />
            </div>
            <span className="status-label">{xpInBar}/{xpBarSize} XP</span>
          </div>
        </div>
        <div className="status-divider" />
        <div id="status-coins">
          <span id="status-coins-icon"><GiCrownCoin /></span>
          <span>{profile.coins ?? 0}</span>
        </div>
      </div>
    </div>
  );
}
