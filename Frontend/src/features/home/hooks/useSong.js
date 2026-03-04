import { getSong } from "../service/song.api";
import { useContext } from "react";
import { SongContext } from "../context/song.context";

export const useSong = () => {
  const context = useContext(SongContext);

  const { song, loading, setSong, setLoading } = context;

  async function handleGetSong({ mood }) {
    setLoading(true);
    const data = await getSong({ mood });
    setSong(data.song);
    setLoading(false);
  }

  return { loading, song, handleGetSong };
};
