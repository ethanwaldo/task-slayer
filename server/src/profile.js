const CLASSES = ["Warrior", "Scholar", "Bard", "Monk", "Rogue"];
export function isClass(class_) { return CLASSES.includes(class_); }

export const STAT_NAMES = {
  STR: "Strength",
  INT: "Intelligence",
  AGI: "Agility",
  CON: "Constitution",
  CHA: "Charisma",
};

export function getProfile(user) {
  return {
    displayName: user.username,
    class_: user.class_,
    monsters: user.monsters || [],
    hp: user.hp,
    exp: user.exp,
    stats: user.stats,
    coins: user.coins,
    title: user.title,
    items: user.items,
  };
}
