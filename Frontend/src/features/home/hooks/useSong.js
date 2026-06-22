import { getSong, getSongById, getSimilarSongs } from "../service/song.api";
import { recordPlay } from "../service/history.api";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { SongContext } from "../context/song.context";

export const useSong = () => {
  const context = useContext(SongContext);
  const navigate = useNavigate();

  const { song, loading, setSong, setLoading } = context;
  const [similar, setSimilar] = useState([]);
  const [error, setError] = useState(null);

  async function loadSimilar(songId) {
    try {
      const data = await getSimilarSongs(songId);
      setSimilar(data.similar);
    } catch (err) {
      console.error("Failed to fetch similar songs:", err);
    }
  }

  // Called by the mood-detection flow. Fetches a random song for the mood,
  // then redirects to its dedicated player page.
  async function handleGetSong({ mood }) {
    setLoading(true);
    setError(null);
    try {
      const data = await getSong({ mood });
      setSong(data.song);
      navigate(`/player/${data.song._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't find a song for that mood.");
    } finally {
      setLoading(false);
    }
  }

  // Called when the player page itself loads (direct URL, refresh, or a
  // click from Recently Played / Search). Loads the song by ID, records
  // the play, and fetches similar tracks — does NOT navigate, since the
  // caller is already on the player route.
  async function loadSongById(songId) {
    setLoading(true);
    setError(null);
    try {
      const data = await getSongById(songId);
      setSong(data.song);

      recordPlay(songId).catch((err) =>
        console.error("Failed to record play:", err)
      );

      await loadSimilar(songId);
    } catch (err) {
      setError(err.response?.data?.message || "Song not found.");
    } finally {
      setLoading(false);
    }
  }

  // Called when clicking a result in Search / Recently Played from the
  // Home page — navigates to that song's player page.
  function goToSong(songId) {
    navigate(`/player/${songId}`);
  }

  return {
    loading,
    error,
    song,
    similar,
    handleGetSong,
    loadSongById,
    goToSong,
  };
};