import { useSong } from "../hooks/useSong";
import { Play } from "lucide-react";
import "../style/similarTracks.scss";

const SimilarTracks = ({ onSelectSong }) => {
  const { similar } = useSong();

  if (!similar || similar.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-[#9aa39a]">
        No similar tracks available for this mood yet.
      </div>
    );
  }

  return (
    <section className="similar-tracks">
      <div className="similar-tracks__list">
        {similar.map((song) => (
          <button
            key={song._id}
            className="similar-tracks__card"
            onClick={() => onSelectSong(song._id)}
          >
            <div className="similar-tracks__img-wrap">
              <img src={song.posterUrl} alt={song.title} />
              <div className="similar-tracks__img-overlay">
                <Play size={14} fill="currentColor" className="ml-0.5" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="similar-tracks__name">{song.title}</p>
              <p className="text-xs text-[#9aa39a] font-medium truncate">{song.artist || "Audiom Track"}</p>
            </div>

            <span className="similar-tracks__mood">{song.mood}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default SimilarTracks;