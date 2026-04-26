function Leaderboard() { // CURRENT MOCK DATA TO GET SOMETHING SHOWING
    const players = [
        { id: 1, name: 'Ethan', score: 1200},
        { id: 2, name: 'Riyad', score: 950},
        { id: 3, name: 'Mustafa', score: 750},
        { id: 4, name: 'Anthony', score: 500},
    ];

    const sortedPlayers = [...players].sort((a,b) => b.score - a.score);

    return (
        <section className="Leaderboard">
            <h2>Leaderboard</h2>

            <div className="leaderboard-list">
                {sortedPlayers.map((player, index) => (
                    <div className="leaderboard-row" key={player.id}>
                        <span className="leaderboard-rank">#{index+1}</span>
                        <span className="leaderboard-name">{player.name}</span>
                        <span className="leaderboard-score">{player.score}exp</span>
                        </div>
                ))}
            </div>
        </section>
    );
}

export default Leaderboard;