/**
 * @typedef {object} Stats
 * @property {number} STR
 * @property {number} INT
 * @property {number} AGI
 * @property {number} CON
 * @property {number} CHA
 */

/**
 * @typedef {object} Profile
 * @property {string} displayName
 * @property {Class} class_
 * @property {Monster[]} monsters
 * @property {number} exp
 * @property {Stats} stats
 */

/**
 * @typedef {Guest} User
 */

/**
 * @typedef {object} Guest
 * @property {Session} session
 * @property {Class} class_
 * @property {Monster[]} monsters
 * @property {number} [exp]
 * @property {Stats} [stats]
 */

/**
 * @typedef {object} Session
 * @property {string} id
 * @property {number} created - The result of Date.now() when the session was created.
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
 * @property {string} [primaryStat]
 * @property {string} [id]
 */

/**
 * @typedef {number | "boss"} Level
 */

/**
 * @exports {User}
 */

const classes = /** @type {const} */ (["Warrior", "Scholar", "Bard", "Monk", "Rogue"]);

/**
 * 
 * @param {any} class_ 
 * @returns {class_ is Class}
 */
export function isClass(class_) {
  return classes.includes(class_);
}