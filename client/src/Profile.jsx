import { useEffect, useState } from "react"
import warriorImage from "./assets/warrior.webp";
import scholarImage from "./assets/scholar.png";
import bardImage from "./assets/bard.webp";
import monkImage from "./assets/monk.jpg";
import chevronLeft from "./assets/chevron-left.svg";
import { defaultClass, isClass, nextClass, prevClass } from "./types";
/** @import { Class } from "./types" */

function Profile() {
  const [playerClass, setPlayerClass] = useState(/** @type {Class | null} */ (null));
  const [displayedClass, setDisplayedClass] = useState(defaultClass);
  useEffect(() => {
    fetch("/api/profile/")
      .then(res => res.json())
      .then(data => {
        const class_ = data?.profile?.class_;
        if (isClass(class_)) {
          setPlayerClass(class_);
          setDisplayedClass(class_);
        }
      });
  }, []);
  async function onClickSelect() {
    await fetch("/api/class", {
      method: "POST",
      body: JSON.stringify({
        class_: displayedClass
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    });
    setPlayerClass(displayedClass);
  }
  const onClickPrevClass = () => {
    setDisplayedClass(prevClass(displayedClass));
  }
  const onClickNextClass = () => {
    setDisplayedClass(nextClass(displayedClass));
  }
  const formattedClass = `The ${displayedClass}`;
  return (
    <>
      <div className="profile-container">
        <h1 className="page-heading">Select Class</h1>
        <div className="profile-main">
          <button onClick={onClickPrevClass} className="profile-change-class-button">
            <img alt="left arrow" src={chevronLeft}></img>
          </button>
          <ClassImage class_={displayedClass} />
          <button onClick={onClickNextClass} className="profile-change-class-button">
            <img className="profile-change-class-button-right-img" alt="right arrow" src={chevronLeft}></img>
          </button>
        </div>
        <h2 className="profile-class-name" >{formattedClass}</h2>
        {displayedClass === playerClass ?
          <button className="profile-selected-indicator" disabled>
            Selected
          </button> :
          <button className="profile-select-button" onClick={onClickSelect}>Select</button>
        }
      </div>      
    </>
  );
}

/**
 * 
 * @param {Class} class_ 
 */
function imageSrcFromClass(class_) {
  switch (class_) {
    case "Warrior": return warriorImage;
    case "Scholar": return scholarImage;
    case "Bard": return bardImage;
    case "Monk": return monkImage;
  }
}

/**
 * 
 * @param {{ class_: Class | null }} props 
 */
function ClassImage({ class_ }) {
  return (
    <>
      {class_ === null ?
        <div>Loading...</div> :
        <img className="profile-class-image" src={imageSrcFromClass(class_)}></img>
      }
    </>
  );
}

export default Profile;
