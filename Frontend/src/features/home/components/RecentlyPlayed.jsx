import { useHistory } from "../hooks/useHistory";
import { History, Play } from "lucide-react";
import "../style/recentlyPlayed.scss";

const RecentlyPlayed = ({ onSelectSong }) => {
  const { recent, loading } = useHistory();

  if (loading) {
    return <div className="recently-played__status">Loading recent tracks…</div>;
  }

  if (!recent || recent.length === 0) {
    return null;
  }

  return (
    <div className="recently-played">
      <h3 className="recently-played__title">
        <History size={20} className="recently-played__title-icon" />
        Recently Played
      </h3>
      <div className="recently-played__list">
        {recent.map(({ song }) => (
          <button
            key={song._id}
            className="recently-played__card group"
            onClick={() => onSelectSong(song._id)}
          >
            <div className="recently-played__img-wrapper">
              <img src={song.posterUrl} alt={song.title} />
              <div className="recently-played__img-overlay">
                <Play fill="currentColor" size={20} className="text-white" />
              </div>
            </div>
            
            <div className="recently-played__info">
              <h4 className="recently-played__name">{song.title}</h4>
              <p className="recently-played__artist">{song.artist || "Unknown Artist"}</p>
            </div>

            <div className="recently-played__mood-badge">
              <span>{song.mood}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentlyPlayed;