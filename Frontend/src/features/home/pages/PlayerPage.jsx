import { useEffect } from "react";
import { useParams } from "react-router";
import { useSong } from "../hooks/useSong";
import Player from "../components/Player";
import SimilarTracks from "../components/SimilarTracks";
import Comments from "../components/Comments";
import "../style/playerPage.scss";

const PlayerPage = () => {
  const { id } = useParams();
  const { song, loading, error, loadSongById, goToSong } = useSong();

  useEffect(() => {
    if (id) loadSongById(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading && !song) {
    return <div className="player-page__status">Loading song…</div>;
  }

  if (error) {
    return <div className="player-page__status player-page__status--error">{error}</div>;
  }

  if (!song) {
    return null;
  }

  return (
    <div className="player-page">
      <div className="player-page__hero">
        <img src={song.posterUrl} alt={song.title} className="player-page__poster" />
      </div>

      <div className="player-page__content">
        <Player />

        <SimilarTracks onSelectSong={goToSong} />

        <Comments songId={id} />
      </div>
    </div>
  );
};

export default PlayerPage;