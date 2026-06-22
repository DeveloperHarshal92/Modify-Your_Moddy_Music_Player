import { useHistory } from "../hooks/useHistory";
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
    <section className="recently-played">
      <h2 className="recently-played__title">Recently Played</h2>
      <div className="recently-played__list">
        {recent.map(({ song }) => (
          <button
            key={song._id}
            className="recently-played__card"
            onClick={() => onSelectSong(song._id)}
          >
            <img src={song.posterUrl} alt={song.title} />
            <span className="recently-played__name">{song.title}</span>
            <span className="recently-played__mood">{song.mood}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default RecentlyPlayed;