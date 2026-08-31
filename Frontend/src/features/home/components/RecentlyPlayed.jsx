import { useHistory } from "../hooks/useHistory";
import { PUBLIC_TRACKS } from "../data/publicMusicCatalog";
import { History, Play, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import "../style/recentlyPlayed.scss";

const RecentlyPlayed = ({ onSelectSong }) => {
  const { recent, loading } = useHistory();

  // If user has recent items, use them; otherwise show top trending public tracks
  const displayItems =
    recent && recent.length > 0
      ? recent.map((r) => r.song).filter(Boolean)
      : PUBLIC_TRACKS.slice(0, 6);

  const isShowingRecent = recent && recent.length > 0;

  return (
    <div className="recently-played">
      <div className="recently-played__header">
        <h3 className="recently-played__title">
          {isShowingRecent ? (
            <History size={18} className="recently-played__title-icon" />
          ) : (
            <Sparkles size={18} className="recently-played__title-icon" />
          )}
          {isShowingRecent ? "Recently Streamed" : "Trending Frequencies"}
        </h3>
        <span className="text-xs font-semibold text-[#9ca3af]">
          {displayItems.length} tracks
        </span>
      </div>

      <div className="recently-played__grid">
        {displayItems.map((song, idx) => (
          <motion.button
            key={song._id || idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: idx * 0.04 }}
            className="recently-played__card group"
            onClick={() => onSelectSong(song._id)}
          >
            <div className="recently-played__img-wrapper">
              <img src={song.posterUrl} alt={song.title} loading="lazy" />
              <div className="recently-played__img-overlay">
                <div className="recently-played__play-bubble">
                  <Play fill="currentColor" size={14} className="ml-0.5" />
                </div>
              </div>
            </div>

            <div className="recently-played__info">
              <h4 className="recently-played__name">{song.title}</h4>
              <p className="recently-played__artist">{song.artist || song.mood || "Audiom"}</p>
            </div>

            <div className="recently-played__mood-badge">
              <span>{song.mood}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default RecentlyPlayed;