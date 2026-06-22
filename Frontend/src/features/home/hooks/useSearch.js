import { useState, useRef, useCallback } from "react";
import { searchSongs } from "../service/song.api";

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
      const data = await searchSongs(value.trim());
      setResults(data.results);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = useCallback(
    (value) => {
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => runSearch(value), 350);
    },
    [runSearch]
  );

  return { query, results, loading, handleChange };
};