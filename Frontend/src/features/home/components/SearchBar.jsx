import { useEffect, useRef } from "react";
import { useSearch } from "../hooks/useSearch";
import { Search, Play } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import "../style/searchBar.scss";

const SearchBar = ({ onSelectSong }) => {
  const { query, results, loading, handleChange } = useSearch();
  const inputRef = useRef(null);

  // Global shortcut (Cmd+K or Ctrl+K) to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="search-bar">
      <div className="search-bar__input-wrapper">
        <Search size={18} className="search-bar__icon" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search tracks, vibes, artists…"
          className="search-bar__input"
        />
        {!loading && !query && (
          <span className="search-bar__shortcut">
            <span>⌘</span>K
          </span>
        )}
      </div>

      {loading && <span className="search-bar__spinner" />}

      <AnimatePresence>
        {results.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="search-bar__results"
          >
            {results.map((song) => (
              <li
                key={song._id}
                className="search-bar__result"
                onClick={() => onSelectSong(song._id)}
              >
                <div className="search-bar__result-main">
                  <img src={song.posterUrl} alt={song.title} />
                  <div className="min-w-0">
                    <p className="search-bar__result-title">{song.title}</p>
                    <p className="search-bar__result-artist">{song.artist || song.mood || "Audiom"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="search-bar__result-mood">{song.mood}</span>
                  <div className="search-bar__result-play">
                    <Play size={12} fill="currentColor" className="ml-0.5" />
                  </div>
                </div>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;