import { useState, useEffect } from "react";
import PageHeader from "./components/PageHeader";
import { get, post } from "./requests";
import apothecaryImage from "./assets/apothacary.jpg";
import { GiHealthPotion, GiUpgrade, GiBattleAxe, GiCrownCoin, GiCoinsPile, GiSpellBook } from "react-icons/gi";
import { FaPalette } from "react-icons/fa";

const ITEMS = [
  { name: "Critical Hit Boost", price: 25,   icon: <GiBattleAxe />,    desc: "+20% crit multiplier for 24h",             theme: "red"    },
  { name: "Health Potion",      price: 50,   icon: <GiHealthPotion />, desc: "Restore HP to full",                       theme: "red"    },
  { name: "XP Boost",          price: 200,  icon: <GiUpgrade />,      desc: "+20% XP for 24h",                          theme: "green"  },
  { name: "Coin Rush",         price: 250,  icon: <GiCoinsPile />,    desc: "+50% coins for 24h",                       theme: "yellow" },
  { name: "Tome of Knowledge", price: 300,  icon: <GiSpellBook />,    desc: "Instantly gain 500 XP",                    theme: "green"  },
  { name: "Name Color",        price: 1000, icon: <FaPalette />,      desc: "Your leaderboard name glows gold forever", theme: "yellow" },
];

export default function Shop() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    get("/api/profile").then(data => { if (data.profile) setProfile(data.profile); });
  }, []);

  async function buy(item) {
    if (!profile || item.price > (profile.coins ?? 0)) return;
    const data = await post("/api/buy", { name: item.name, price: item.price });
    if (data.profile) setProfile(data.profile);
  }

  return (
    <>
      <PageHeader />
      <div id="shop-main">
        <div id="shop-brand-panel" style={{ backgroundImage: `url(${apothecaryImage})` }}>
          <div id="shop-brand-overlay" />
          <div id="shop-brand-footer">
            <div id="shop-brand-title">Apothecary</div>
            <div id="shop-brand-sub">Spend your coins. Gain an edge.</div>
          </div>
        </div>
        <div id="shop-content">
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
                  disabled={!profile || item.price > (profile.coins ?? 0)}
                >
                  <span>◈</span> {item.price}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
