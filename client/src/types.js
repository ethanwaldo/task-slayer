/**
 * @typedef {object} Profile
 * @property {string} displayName
 * @property {Class} class_
 * @property {Monster[]} monsters
 */

/**
 * @typedef {classes[number]} Class
 */

/**
 * 
 * @typedef {monsterKinds[number]} MonsterKind 
 */

/**
 * @typedef {number | "boss"} Level
 */

/**
 * @exports {User}
 */

const classes = /** @type {const} */ (["Warrior", "Scholar", "Bard", "Monk", "Rogue"]);

const monsterKinds = /** @type {const} */ ([
  "Demon",
  "Dragon",
  "Cyclops",
  "Goblin",
  "Golem",
  "Gorgon",
  "Hydra",
  "Kraken",
  "Mummy",
  "Serpent",
  "Skeleton",
  "Vampire",
  "Werewolf",
  "Witch",
  "Wraith",
  "Zombie",
]);

/** @type {Class} */
export const defaultClass = classes[0];

/**
 * 
 * @param {any} class_ 
 * @returns {class_ is Class}
 */
export function isClass(class_) {
  return classes.includes(class_);
}

/**
 * 
 * @param {Class} class_ 
 * @returns {Class}
 */
export function prevClass(class_) {
  const i = (classes.indexOf(class_) - 1 + classes.length) % classes.length;
  return classes[i];
}

/**
 * 
 * @param {Class} class_ 
 * @returns {Class}
 */
export function nextClass(class_) {
  const i = (classes.indexOf(class_) + 1) % classes.length;
  return classes[i];
}

/**
 * 
 * @returns {MonsterKind}
 */
export function randomMonsterKind() {
  const i = Math.floor(Math.random() * monsterKinds.length);
  return monsterKinds[i];
}


/**
 * @param {Monster} monster
 * @returns {string}
 */
export function monsterName(monster) {
  return `${monster.taskName} ${monster.kind}`;
}