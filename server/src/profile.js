
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
    items: user.items
  };
}