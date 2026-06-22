import React from "react";
import { Link } from "react-router";
import FaceExpression from "../../Expression/components/FaceExpressions";
import SearchBar from "../components/SearchBar";
import RecentlyPlayed from "../components/RecentlyPlayed";
import { useSong } from "../hooks/useSong";
import "../style/home.scss";

const Home = () => {
  const { handleGetSong, goToSong, error } = useSong();

  return (
    <div className="home">
      <header className="home__topbar">
        <h1 className="home__logo">Moodify</h1>
        <SearchBar onSelectSong={goToSong} />
        <Link to="/upload" className="home__upload-link">
          + Upload
        </Link>
      </header>

      {error && <div className="home__error">{error}</div>}

      <div className="home__body">
        <main className="home__main">
          <FaceExpression onClick={(expression) => handleGetSong({ mood: expression })} />
        </main>

        <aside className="home__sidebar">
          <RecentlyPlayed onSelectSong={goToSong} />
        </aside>
      </div>
    </div>
  );
};

export default Home;