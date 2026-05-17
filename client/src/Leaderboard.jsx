import PageHeader from "./components/PageHeader";
import { useEffect, useState } from "react";
import { get } from "./requests";

function Leaderboard() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getLeaderboard = async() => {
            try {
                const data = await get("/api/leaderboard");
                if (data.result !== "success") throw new Error("Failed to fetch leaderboard!");
                setPlayers(data.leaderboard || []);
                setError("");
            } catch (error) {
                console.error("Failed to fetch leaderboard:", error);
                setError("Could not load leaderboard. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        getLeaderboard();
    }, []);

    return (
        <>
        <title>Task Slayer | Leaderboard</title>
        <PageHeader />
        <main id="leaderboard-page">
            <section id="leaderboard-hero">
                <h1 id="leaderboard-heading">Leaderboard</h1>
                <p id="leaderboard-subheading">Top slayers ranked by experience.</p>
            </section>

            <section id="leaderboard-panel">
                <div id="leaderboard-header-row">
                    <span>Rank</span>
                    <span>Slayer</span>
                    <span>Class</span>
                    <span>Experience</span>
                </div>

                {loading && (
                    <div className="leaderboard-row leaderboard-message-row">
                        <span>Loading leaderboard...</span>
                    </div>
                )}

                {!loading && error && (
                    <div className="leaderboard-row leaderboard-message-row leaderboard-error">
                        <span>{error}</span>
                    </div>
                )}

                {!loading && !error && players.length === 0 && (
                    <div className="leaderboard-row leaderboard-message-row">
                        <span>No slayers ranked yet.</span>
                    </div>
                )}

                {!loading && players.map((player, index) => (
                    <div className="leaderboard-row" key={player.id}>
                        <span className="leaderboard-rank">#{index + 1}</span>
                        <div className="leaderboard-name-container">
                            <div className="leaderboard-name" style={player.nameColor ? { color: "var(--color-gold)" } : undefined}>{player.name}</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--color-gray-400)", fontWeight: "normal" }}>
                                {player.title}
                            </div>
                        </div>
                        <span className="leaderboard-class">{player.classType} (Lvl {player.level})</span>
                        <span className="leaderboard-exp">{Number(player.exp).toLocaleString()} XP</span>
                    </div>
                ))}
            </section>
        </main>
        </>
    );
}

export default Leaderboard;
