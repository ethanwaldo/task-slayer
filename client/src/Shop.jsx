import { useState, useEffect } from "react";
import PageHeader from "./components/PageHeader";
import { get, post } from "./requests";
import { GiHealthPotion, GiUpgrade, GiBattleAxe, GiCrownCoin, GiCoinsPile, GiSpellBook, GiVisoredHelm, GiMusicalNotes, GiFist, GiNinjaMask } from "react-icons/gi";
import { FaPalette } from "react-icons/fa";

const ITEMS = [
  { name: "Critical Hit Boost", price: 25,   icon: <GiBattleAxe />,    desc: "+20% crit multiplier for 24h",             theme: "red"    },
  { name: "Health Potion",      price: 50,   icon: <GiHealthPotion />, desc: "Restore HP to full",                       theme: "red"    },
  { name: "XP Boost",          price: 200,  icon: <GiUpgrade />,      desc: "+20% XP for 24h",                          theme: "green"  },
  { name: "Coin Rush",         price: 250,  icon: <GiCoinsPile />,    desc: "+50% coins for 24h",                       theme: "yellow" },
  { name: "Tome of Knowledge", price: 300,  icon: <GiSpellBook />,    desc: "Instantly gain 500 XP",                    theme: "green"  },
  { name: "Name Color",        price: 1000, icon: <FaPalette />,      desc: "Your leaderboard name glows gold forever", theme: "yellow" },
  { name: "Class: Warrior", price: 2000, class_: "Warrior", icon: <GiVisoredHelm />, desc: "Change your class to Warrior", theme: "purple" },
  { name: "Class: Scholar", price: 2000, class_: "Scholar", icon: <GiSpellBook />,     desc: "Change your class to Scholar", theme: "purple" },
  { name: "Class: Bard",    price: 2000, class_: "Bard",    icon: <GiMusicalNotes />,  desc: "Change your class to Bard",    theme: "purple" },
  { name: "Class: Monk",    price: 2000, class_: "Monk",    icon: <GiFist />,           desc: "Change your class to Monk",    theme: "purple" },
  { name: "Class: Rogue",   price: 2000, class_: "Rogue",   icon: <GiNinjaMask />,     desc: "Change your class to Rogue",   theme: "purple" },
];

export default function Shop() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    get("/api/profile").then(data => { if (data.profile) setProfile(data.profile); });
  }, []);

  async function buy(item) {
    if (!profile || item.price > (profile.coins ?? 0)) return;
    const body = { name: item.name, price: item.price };
    if (item.class_) body.class_ = item.class_;
    const data = await post("/api/buy", body);
    if (data.profile) setProfile(data.profile);
  }

  return (
    <>
      <title>Task Slayer | Shop</title>
      <PageHeader />
      <div id="shop-main">
        <div id="shop-content">
          <div id="shop-hero">
            <h1 id="shop-heading">Apothecary</h1>
            <p id="shop-subheading">Spend your coins. Gain an edge.</p>
          </div>
          <div id="shop-balance">
            <span id="shop-balance-icon"><GiCrownCoin /></span>
            <span>{profile !== null ? (profile.coins ?? 0) : "—"}</span>
          </div>
          <div id="shop-grid">
            {ITEMS.map(item => (
              <div className={`shop-item ${item.theme}`} key={item.name}>
                <div className="shop-item-icon">{item.icon}</div>
                <div className="shop-item-name">{item.name}</div>
                <div className="shop-item-desc">{item.desc}</div>
                <button
                  className="shop-item-buy"
                  onClick={() => buy(item)}
                  disabled={!profile || (item.class_ && profile.class_ === item.class_) || (item.name === "Name Color" && profile.items?.nameColor) || item.price > (profile.coins ?? 0)}
                >
                  {item.class_ && profile?.class_ === item.class_ ? "Current Class"
                    : item.name === "Name Color" && profile?.items?.nameColor ? "Owned"
                    : <><span>◈</span> {item.price}</>}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
