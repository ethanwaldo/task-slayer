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
 * @typedef {object} Monster
 * @property {string} name
 * @property {string} task
 * @property {Level} level
 * @property {number} currentHp
 * @property {number} maxHp
 */

/**
 * @typedef {number | "boss"} Level
 */

/**
 * @exports {User}
 */

const classes = /** @type {const} */ (["Warrior", "Scholar", "Bard", "Monk"]);
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
  const i = (classes.indexOf(class_) - 1 + 4) % classes.length;
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
