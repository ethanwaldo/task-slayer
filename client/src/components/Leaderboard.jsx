import { useEffect, useState } from "react";

function Leaderboard() {
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
        <div className="leaderboard-container pt-16 sm:pt-8 w-full">
            <title>Leaderboard - Task Slayer</title>
            
            <header className="leaderboard-header" style={{ textAlign: 'center' }}>
                <h1>Leaderboard</h1>
                <p style={{ color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '8px' }}>
                    Top Slayers Ranked by Experience
                </p>
            </header>

            <div className="leaderboard-card mx-6">
                <div className="leaderboard-row header">
                    <span>Rank</span>
                    <span>Slayer</span>
                    <span className="leaderboard-class">Class</span>
                    <span style={{ textAlign: 'right' }}>Experience</span>
                </div>

                {loading && (
                    <div className="leaderboard-row">
                        <span></span>
                        <span>Loading leaderboard...</span>
                        <span className="leaderboard-class"></span>
                        <span></span>
                    </div>
                )}

                {!loading && players.length === 0 && (
                    <div className="leaderboard-row">
                        <span></span>
                        <span>No slayers ranked yet.</span>
                        <span className="leaderboard-class"></span>
                        <span></span>
                    </div>
                )}

                {!loading && players.map((player, index) => (
                    <div className="leaderboard-row" key={player.id}>
                        <span className="leaderboard-rank">
                            {index === 0 ? <span className="material-symbols-outlined" style={{color: "var(--color-gold)"}}>emoji_events</span> : `#${index+1}`}
                        </span>
                        <span className="leaderboard-name">{player.name}</span>
                        <span className="leaderboard-class" style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>{player.classType}</span>
                        <span className="leaderboard-exp">{player.exp} XP</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Leaderboard;