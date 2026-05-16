import { FaHeart } from "react-icons/fa";
import { GiAbstract039, GiAbstract069, GiAbstract091, GiTwoCoins } from "react-icons/gi";
import { TbCoin, TbCoinFilled } from "react-icons/tb";

const reviveCost = 1;

export default function Status({ profile, revive }) {
  const maxHp = getPlayerMaxHp(profile.exp);

  // TODO: remove when we add an `hp` field to User
  profile.hp = profile.hp || maxHp;

  const pHp = (profile.hp / maxHp) * 100;
  const pXp = getPXp(profile.exp) * 100;
  const level = levelFromXp(profile.exp);
  const xpInBar = profile.exp - xpFromLevel(level);
  const xpBarSize = xpFromLevel(level + 1) - xpFromLevel(level);
  return (
    <div className="flex justify-center">
      <div className="w-full flex flex-col items-center mx-6 max-w-90">
        <div className="w-full grid gap-x-2 items-center" style={{ gridTemplateColumns: "max-content auto", gridTemplateRows: "auto min-content" }}>
          <FaHeart className="text-red-500 col-1 row-1 w-8 h-8" />
          <div className="grow h-2 bg-gray-500 rounded-full">
            <div
              className="h-full bg-red-500 rounded-full col-2 row-1"
              style={{ width: `${pHp}%` }}
            ></div>
          </div>
          <div className=" text-red-500 col-2 row-2 -mt-2">{Math.round(profile.hp)}/{maxHp}</div>
        </div>
        <div className="w-full grid gap-x-2 items-center mt-2" style={{ gridTemplateColumns: "max-content auto", gridTemplateRows: "auto min-content" }}>
          <div className="text-green-400 flex text-xl col-1 row-1 pb-0.5 w-8 h-8 items-center justify-center border-2 border-green-400 rounded-full font-bold">{level}</div>
          <div className="grow h-2 bg-gray-500 rounded-full">
            <div
              className="h-full bg-green-400 rounded-full col-2 row-1"
              style={{ width: `${pXp}%` }}
            ></div>
          </div>
          <div className=" text-green-400 col-2 row-2 -mt-2">{xpInBar}/{xpBarSize}</div>
        </div>
        <div className="w-full grid gap-x-2 items-center mt-2" style={{ gridTemplateColumns: "min-content min-content auto" }}>
          <GiAbstract069 className="text-amber-300 w-8 h-8" />
          <div className="text-amber-300">{profile.coins}</div>
          {profile.hp < 0 && (
            <div className="justify-self-end">
              <button onClick={revive} className="cursor-pointer bg-red-500 rounded text-gray-300 font-bold p-1.5">Revive? ({reviveCost})</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 
 * @param {number} xp
 * @returns {number}
 */
function getPlayerMaxHp(xp) {
  return 10 + levelFromXp(xp) - 1;
}

/**
 * 
 * @param {number} xp
 * @returns {number}
 */
function getPXp(xp) {
  const level = levelFromXp(xp);
  const max = xpFromLevel(level + 1);
  const min = xpFromLevel(level);
  return (xp - min) / (max - min);
}

function levelFromXp(xp) {
  return Math.floor((xp || 0) / 1000) + 1;
}

function xpFromLevel(level) {
  return (level - 1) * 1000;
}
