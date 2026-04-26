import Nav from "../Nav";

function Leaderboard() { // CURRENT MOCK DATA TO GET SOMETHING SHOWING
    const players = [
        { id: 1, name: 'Ethan', score: 1200},
        { id: 2, name: 'Riyad', score: 950},
        { id: 3, name: 'Mustafa', score: 750},
        { id: 4, name: 'Anthony', score: 500},
    ];

    const sortedPlayers = [...players].sort((a,b) => b.score - a.score);

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

                {sortedPlayers.map((player, index) => (
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