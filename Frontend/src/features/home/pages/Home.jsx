import React from "react";
import { Link } from "react-router";
import { Smile, Plus } from "lucide-react";
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
        <div className="home__logo-wrapper">
          <Smile size={28} className="home__logo-icon" />
          <h1 className="home__logo">Moodify</h1>
        </div>
        <div className="home__search-wrapper">
          <SearchBar onSelectSong={goToSong} />
        </div>
        <Link to="/upload" className="home__upload-link">
          <Plus size={16} /> Upload
        </Link>
      </header>

      {error && <div className="home__error">{error}</div>}

      <main className="home__main">
        <section className="home__card">
          <div className="home__card-header">
            <h2 className="home__card-title">Capture Your Mood</h2>
            <p className="home__card-subtitle">Let the music match your current vibe.</p>
          </div>
          <FaceExpression onClick={(expression) => handleGetSong({ mood: expression })} />
        </section>

        <section className="home__card home__card--recent">
          <RecentlyPlayed onSelectSong={goToSong} />
        </section>
      </main>
    </div>
  );
};

export default Home;