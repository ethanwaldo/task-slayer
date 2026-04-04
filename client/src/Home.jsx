function Home() {
  return (
    <>
      <div className="hero">
        <div className="hero-heading">Task Slayer</div>
        <div className="hero-subheading">Finish tasks. Slay monsters. Level up.</div>
      </div>
      <div className="home-monsters-section">
        <div className="home-monsters-container">
          <h2 className="home-monsters-heading">What monsters will we slay today?</h2>
          <input className="home-monsters-input"></input>
          <div className="home-monsters-suggestions"></div>
        </div>
      </div>
    </>
  );
}

export default Home;