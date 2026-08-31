import { getSong, getSongById, getSimilarSongs } from "../service/song.api";
import { recordPlay } from "../service/history.api";
import {
  getPublicSongByMood,
  getPublicSongById,
  getPublicSimilarSongs,
  PUBLIC_TRACKS,
} from "../data/publicMusicCatalog";
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
      if (songId && String(songId).startsWith("pub-")) {
        setSimilar(getPublicSimilarSongs(songId));
        return;
      }
      const data = await getSimilarSongs(songId);
      if (data && data.similar && data.similar.length > 0) {
        setSimilar(data.similar);
      } else {
        setSimilar(getPublicSimilarSongs(songId));
      }
    } catch (err) {
      console.warn("Falling back to public similar tracks:", err.message);
      setSimilar(getPublicSimilarSongs(songId));
    }
  }

  // Called by the mood-detection flow. Fetches a song for the mood,
  // then redirects to its dedicated player page.
  async function handleGetSong({ mood }) {
    setLoading(true);
    setError(null);
    try {
      let matchedSong = null;
      try {
        const data = await getSong({ mood });
        if (data && data.song) {
          matchedSong = data.song;
        }
      } catch (apiErr) {
        console.warn("Backend song API unavailable, using public catalog:", apiErr.message);
      }

      if (!matchedSong) {
        matchedSong = getPublicSongByMood(mood);
      }

      setSong(matchedSong);
      navigate(`/player/${matchedSong._id}`);
      return true;
    } catch (err) {
      const fallback = getPublicSongByMood(mood);
      setSong(fallback);
      navigate(`/player/${fallback._id}`);
      return true;
    } finally {
      setLoading(false);
    }
  }

  // Loads song by ID (supports public catalog IDs or Mongo ObjectIds)
  async function loadSongById(songId) {
    setLoading(true);
    setError(null);
    try {
      if (songId && String(songId).startsWith("pub-")) {
        const pubSong = getPublicSongById(songId);
        if (pubSong) {
          setSong(pubSong);
          await loadSimilar(songId);
          return;
        }
      }

      try {
        const data = await getSongById(songId);
        if (data && data.song) {
          setSong(data.song);
          recordPlay(songId).catch(() => {});
          await loadSimilar(songId);
          return;
        }
      } catch (err) {
        console.warn("Song not in backend DB, checking public catalog:", err.message);
      }

      const fallback = getPublicSongById(songId) || PUBLIC_TRACKS[0];
      setSong(fallback);
      await loadSimilar(fallback._id);
    } catch (err) {
      setError("Unable to load track.");
    } finally {
      setLoading(false);
    }
  }

  function goToSong(songId) {
    navigate(`/player/${songId}`);
  }

  return {
    loading,
    error,
    song,
    similar,
    publicTracks: PUBLIC_TRACKS,
    handleGetSong,
    loadSongById,
    goToSong,
  };
};

