import { useSearch } from "../hooks/useSearch";
import "../style/searchBar.scss";

const SearchBar = ({ onSelectSong }) => {
  const { query, results, loading, handleChange } = useSearch();

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search songs by title…"
        className="search-bar__input"
      />
      {loading && <span className="search-bar__spinner" />}

      {results.length > 0 && (
        <ul className="search-bar__results">
          {results.map((song) => (
            <li
              key={song._id}
              className="search-bar__result"
              onClick={() => onSelectSong(song._id)}
            >
              <img src={song.posterUrl} alt={song.title} />
              <div>
                <p className="search-bar__result-title">{song.title}</p>
                <span className="search-bar__result-mood">{song.mood}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;