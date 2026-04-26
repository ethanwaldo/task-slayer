import Nav from "../Nav";
import { useEffect, useState } from "react";

function Leaderboard() { // CURRENT MOCK DATA TO GET SOMETHING SHOWING
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:5000/api/leaderboard")
        .then((res) => res.json())
        .then((data) => {
            setPlayers(data.leaderboard || []);
            setLoading(false);
        })
        .catch((error) => {
            console.error("Failed to fetch leaderboard:", error);
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

                {loading && (
                    <div className="leaderboard-row">
                        <span></span>
                        <span>Loading leaderboard...</span>
                    </div>
                )}

                {!loading && players.length === 0 && (
                    <div className="leaderboard-row">
                        <span></span>
                        <span>No slayers ranked yet.</span>
                    </div>
                )}

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