/** @import { Profile, User } from "./types" */

/**
 * @param {User} user
 * @returns {Profile}
 */
export function getProfile(user) {
  const exp = user.exp || 0;
  const stats = user.stats || { STR: 10, INT: 10, AGI: 10, CON: 10, CHA: 10 };

  return {
    displayName: displayName(user),
    class_: user.class_,
    monsters: user.monsters,
    exp,
    stats,
  };
}

/**
 * @param {User} user
 * @returns {string}
 */
export function displayName(user) {
  return "Guest";
}