function Leaderboard() { // CURRENT MOCK DATA TO GET SOMETHING SHOWING
    const players = [
        { id: 1, name: 'Ethan', score: 1200},
        { id: 2, name: 'Riyad', score: 950},
        { id: 3, name: 'Mustafa', score: 750},
        { id: 4, name: 'Anthony', score: 500},
    ];

    const sortedPlayers = [...players].sort((a,b) => b.score - a.score);

    return (
        <main className="leaderboard-page">
            <section className="leaderboard-hero">
                <h1>Leaderboard</h1>
                <p>Top slayers ranked by experience earned.</p>
            </section>

            <section className="leaderboard-panel">
                <div className="leaderboard-header">
                    <span>Rank</span>
                    <span>Slayer</span>
                    <span>Class</span>
                    <span>EXP</span>
                </div>

                {sortedPlayers.map((player, index) => (
                    <div className="leaderboard-row" key={player.id}>
                        <span className="rank">#{index+1}</span>
                        <span className="player-name">{player.name}</span>
                        <span className="class-type">{player.classType}</span>
                        <span className="exp">{player.exp}</span>
                        </div>
                ))}
            </section>
        </main>
    );
}

export default Leaderboard;