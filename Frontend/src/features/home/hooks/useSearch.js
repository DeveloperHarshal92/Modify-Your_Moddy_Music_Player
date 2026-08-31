import { useState, useRef, useCallback } from "react";
import { searchSongs } from "../service/song.api";
import { searchPublicTracks } from "../data/publicMusicCatalog";

export const useSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const runSearch = useCallback(async (value) => {
    if (!value || value.trim().length === 0) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const publicMatches = searchPublicTracks(value.trim());
      let backendMatches = [];
      try {
        const data = await searchSongs(value.trim());
        if (data && data.results) {
          backendMatches = data.results;
        }
      } catch (err) {
        console.warn("Backend search fallback to public tracks:", err.message);
      }

      // Combine matches without duplicates
      const map = new Map();
      backendMatches.forEach((item) => map.set(item._id, item));
      publicMatches.forEach((item) => {
        if (!map.has(item._id)) map.set(item._id, item);
      });

      setResults(Array.from(map.values()));
    } catch (err) {
      console.error("Search error:", err);
      setResults(searchPublicTracks(value.trim()));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = useCallback(
    (value) => {
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => runSearch(value), 300);
    },
    [runSearch]
  );

  return { query, results, loading, handleChange };
};