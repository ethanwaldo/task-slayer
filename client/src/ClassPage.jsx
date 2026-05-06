import { useEffect, useState } from "react"
import warriorImage from "./assets/warrior.webp";
import scholarImage from "./assets/scholar.png";
import bardImage from "./assets/bard.webp";
import monkImage from "./assets/monk.jpg";

function ClassPage() {
  const [playerClass, setPlayerClass] = useState(null);

  useEffect(() => {
    fetch("/api/profile")
      .then(res => res.json())
      .then(data => {
        if (data.profile?.class_) {
          setPlayerClass(data.profile.class_);
        }
      });
  }, []);

  return (
    <div className="class-page">
      <title>Your Hero - Task Slayer</title>
      
      <div className="class-preview">
        <ClassImage class_={playerClass} />
        <div className="class-info-overlay">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span className="material-symbols-outlined" style={{ color: "var(--color-primary)" }}>auto_awesome</span>
            <p style={{ color: "var(--color-primary)", fontWeight: "bold", textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "0.2em" }}>Passives</p>
          </div>
          <p style={{ fontSize: "1.2rem", fontWeight: "500", maxWidth: "400px" }}>
            {playerClass === "Scholar" && "Focus increases by 15% during deep study sessions. +100% bonus to INT stat gains."}
            {playerClass === "Warrior" && "Relentless force. +100% bonus to STR stat gains."}
            {playerClass === "Bard" && "Social weaver. +100% bonus to CHA stat gains."}
            {playerClass === "Monk" && "Disciplined. +100% bonus to CON stat gains."}
            {playerClass === "Rogue" && "Swift and unseen. +100% bonus to AGI stat gains."}
          </p>
        </div>
      </div>

      <div className="class-selection" style={{ justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h4 style={{ color: "var(--color-primary)", fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "8px" }}>Permanent Archetype</h4>
          <h2 style={{ fontSize: "3rem", fontWeight: "bold", letterSpacing: "-0.02em" }}>{playerClass || "Loading..."}</h2>
          <p style={{ color: "var(--color-text-muted)", marginTop: "16px", maxWidth: "300px", margin: "16px auto" }}>
            Your archetype was forged in the fires of registration and cannot be changed. Embrace your destiny!
          </p>
        </div>
      </div>
    </div>
  );
}

function ClassImage({ class_ }) {
  return (
    <>
      {class_ === null ?
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>Loading...</div> :
        <img className="class-image" src={imageSrcFromClass(class_)}></img>
      }
    </>
  );
}

function imageSrcFromClass(class_) {
  switch (class_) {
    case "Warrior": return warriorImage;
    case "Scholar": return scholarImage;
    case "Bard": return bardImage;
    case "Monk": return monkImage;
    case "Rogue": return scholarImage; // Fallback image for now until we add a rogue image
    default: return scholarImage; // Fallback
  }
}

export default ClassPage;
