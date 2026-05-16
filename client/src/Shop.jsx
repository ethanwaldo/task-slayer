import { useState, useEffect } from "react";
import { BiSolidCoinStack } from "react-icons/bi";
import { FaPaintBrush } from "react-icons/fa";
import { GiAbstract069, GiHealthPotion, GiStandingPotion, GiTwoCoins } from "react-icons/gi";
import { IoMdBrush } from "react-icons/io";
import { PiSword } from "react-icons/pi";
import Header from "./components/Header";
import { post } from "./requests";

const items = [
  {
    name: "Health Potion",
    price: 50,
  },
  {
    name: "XP Boost",
    price: 200,
  },
  {
    name: "Critical Hit Boost",
    price: 25,
  },
  {
    name: "Coin Rush",
    price: 250,
  },
  {
    name: "Name Color",
    price: 1000,
  }
];

export default function Shop() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.profile) {
        data.profile.hp = (typeof data.profile.hp === "number") ? data.profile.hp : 10; // TODO: remove
        setProfile(data.profile);
      }
    } catch (e) {
      console.error("Failed to fetch profile", e);
    }
  }

  async function buy(item) {
    if (profile === null) return;
    let hp = profile.hp;
    if (item.price > profile.coins) return;

    await post("/api/buy", item);
    
    await fetchProfile();
  }

  return (
    <>
      <Header />
      <h1 className="text-white text-center text-4xl mt-20 md:mt-8">Shop</h1>
      <div className="flex justify-center">
        <div className="mt-6 flex items-center p-2 justify-center gap-x-2 text-white bg-slate-600 border-2 border-slate-500 rounded">
          <GiAbstract069 className="text-amber-300 text-xl" />
          <div>{profile !== null && profile.coins}</div>
        </div>
      </div>
      <div className="flex justify-center mb-8">
        <div className="grid mt-8 gap-x-10 gap-y-7 item-grid-cols">
          {items.map(item => (
            <Item key={item.name} name={item.name} price={item.price} buy={buy} />
          ))}
        </div>
      </div>
    </>
  );
}

function Item({ name, price, buy }) {
  function buyItem() {
    buy(items.find(item => item.name === name));
  }
  return (
    <div className="flex flex-col gap-y-2 p-2 w-50 bg-slate-600 rounded">
      <div className="text-white text-center">{name}</div>
      <div className="w-full h-40 p-3 bg-slate-800">
        <ItemImage name={name} />
      </div>
      <button className="cursor-pointer flex items-center rounded py-1 gap-x-1 justify-center bg-purple-600" onClick={buyItem}>
        <GiAbstract069 className="mt-px text-lg text-amber-300" />
        <div className="text-white">{price}</div>
      </button>
    </div>
  );
}

function ItemImage({ name }) {
  switch (name) {
    case "Health Potion": {
      return (<GiHealthPotion className="w-full h-full text-red-600" />);
    }
    case "XP Boost": {
      return (<GiStandingPotion className="w-full h-full text-green-400" />);
    }
    case "Critical Hit Boost": {
      return (<PiSword className="w-full h-full text-indigo-600" />);
    }
    case "Coin Rush": {
      return (<BiSolidCoinStack className="w-full h-full text-amber-300" />);
    }
    case "Name Color": {
      return (<IoMdBrush className="w-full h-full text-fuchsia-600" />);
    }
  }
}
