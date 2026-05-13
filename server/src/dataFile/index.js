import { User } from '../models/User.js';
/** @import { User as UserType } from "../types" */

/**
 * @returns {Promise<UserType[]>}
 */
async function getUsers() {
  try {
    const users = await User.find().lean();
    // Filter out old legacy accounts from the previous AI schema that lack a session
    return users.filter(u => u.session && u.session.id);
  } catch (e) {
    return [];
  }
}

/**
 * @param {UserType} user
 */
async function addUser(user) {
  try {
    const newUser = new User(user);
    await newUser.save();
  } catch (e) {
    console.error("Failed to add user to Mongo:", e);
  }
}

/**
 * @param {UserType} user
 */
async function updateUser(user) {
  try {
    await User.findOneAndUpdate(
      { "session.id": user.session.id },
      user,
      { upsert: true }
    );
  } catch (e) {
    console.error("Failed to update user in Mongo:", e);
  }
}

const dataFile = {
  getUsers,
  addUser,
  updateUser,
};

export default dataFile;