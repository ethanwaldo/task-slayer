
export function getProfile(user) {
  return {
    displayName: user.username,
    class_: user.class_,
    monsters: user.monsters || [],
    exp: user.exp,
    stats: user.stats,
    coins: user.coins,
    title: user.title
  };
}