import { useSong } from "../hooks/useSong";
import "../style/similarTracks.scss";

const SimilarTracks = ({ onSelectSong }) => {
  const { similar } = useSong();

  if (!similar || similar.length === 0) {
    return null;
  }

  return (
    <section className="similar-tracks">
      <h2 className="similar-tracks__title">You might also like</h2>
      <div className="similar-tracks__list">
        {similar.map((song) => (
          <button
            key={song._id}
            className="similar-tracks__card"
            onClick={() => onSelectSong(song._id)}
          >
            <img src={song.posterUrl} alt={song.title} />
            <span className="similar-tracks__name">{song.title}</span>
            <span className="similar-tracks__mood">{song.mood}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default SimilarTracks;