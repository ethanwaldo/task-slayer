import Nav from "../Nav";
import { useEffect, useState } from "react";

function Leaderboard() { // UPDATED DATA TO CONNECT TO BACKEND
    const [players, setPlayers] = useState([]); // Checks if leaderboard data returned from backend
    const [loading, setLoading] = useState(true); // Tracks if leaderboard request is loading

    useEffect(() => { // Get leaderboard data
        fetch("http://localhost:5000/api/leaderboard")
        .then((res) => res.json())
        .then((data) => {
            setPlayers(data.leaderboard || []); // store from api response else output empty array if no data returned
            setLoading(false);
        })
        .catch((error) => {
            console.error("Failed to fetch leaderboard:", error); // debugging errors
            setLoading(false);
        });
    }, []);

    return (
        // NAV BAR
        <>
        <header className="home-header">
            <Nav />
            </header>

        {/* LEADERBOARD CONTEXT */}
        <main className="leaderboard-page">
            <section className="leaderboard-hero">
                <h1 className="leaderboard-heading">Leaderboard</h1>
                <p className="leaderboard-subheading">
                    Top slayers ranked by experience earned.
                </p>
            </section>

            <section className="leaderboard-panel">
                <div className="leaderboard-header-row">
                    <span>Rank</span>
                    <span>Slayer</span>
                    <span>Class</span>
                    <span>Experience</span>
                </div>


                {/* Show loading while waiting for backend response */}
                {loading && (
                    <div className="leaderboard-row">
                        <span></span>
                        <span>Loading leaderboard...</span>
                    </div>
                )}

                {/* Empty state output if request is successful but no users on leaderboard yet */}
                {!loading && players.length === 0 && (
                    <div className="leaderboard-row">
                        <span></span>
                        <span>No slayers ranked yet.</span>
                    </div>
                )}

                {/* Render each player in this format on the leaderboard */}
                {!loading && players.map((player, index) => (
                    <div className="leaderboard-row" key={player.id}>
                        <span className="leaderboard-rank">#{index+1}</span>
                        <span className="leaderboard-name">{player.name}</span>
                        <span className="leaderboard-class">{player.classType}</span>
                        <span className="leaderboard-exp">{player.exp}</span>
                    </div>
                ))}
            </section>
        </main>
        </>
    );
}

export default Leaderboard;