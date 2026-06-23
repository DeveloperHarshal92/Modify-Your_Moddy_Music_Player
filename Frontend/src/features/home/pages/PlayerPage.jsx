import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router";
import { Play, Pause, ChevronsLeft, ChevronsRight, SkipBack, SkipForward, Shuffle, Repeat, ArrowLeft } from "lucide-react";
import { useSong } from "../hooks/useSong";
import { useHistory } from "../hooks/useHistory";
import SimilarTracks from "../components/SimilarTracks";
import Comments from "../components/Comments";
import Loader from "../../../components/Loader";
import "../style/playerPage.scss";

const formatTime = (seconds) => {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

const PlayerPage = () => {
  const { id } = useParams();
  const { song, similar, loading, error, loadSongById, goToSong } = useSong();
  const { recent } = useHistory();

  const audioRef = useRef(null);
  const progressRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (id) loadSongById(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [song?.url]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skip = (secs) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(
      Math.max(audio.currentTime + secs, 0),
      duration
    );
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleProgressClick = (e) => {
    const bar = progressRef.current;
    const rect = bar.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const newTime = ratio * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSongEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    handleNextSong(); // auto-play next song on end
  };

  const handleNextSong = () => {
    if (similar && similar.length > 0) {
      goToSong(similar[0]._id);
    }
  };

  const handlePrevSong = () => {
    if (recent && recent.length > 0) {
      // If current song is recent[0], go to recent[1]
      if (recent[0].song._id === song?._id && recent.length > 1) {
        goToSong(recent[1].song._id);
      } else {
        goToSong(recent[0].song._id);
      }
    }
  };

  if (loading && !song) {
    return <Loader message="Tuning in to your song..." />;
  }

  if (error) {
    return <div className="player-page__status player-page__status--error">{error}</div>;
  }

  if (!song) {
    return null;
  }

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="player-page">
      <Link to="/" className="player-page__back">
        <ArrowLeft size={24} />
        <span className="player-page__back-text">Home</span>
      </Link>
      <audio
        ref={audioRef}
        src={song.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleSongEnd}
      />
      
      <div 
        className="player-page__hero" 
        style={{ backgroundImage: `url(${song.posterUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <img src={song.posterUrl} alt={song.title} className="player-page__poster" />
      </div>

      <div className="player-page__content">
        <div className="player-page__info">
          <h1 className="player-page__title">{song.title}</h1>
          <p className="player-page__mood">{song.mood} • Now Playing</p>
        </div>

        <div className="player-page__progress-wrap">
          <span className="player-page__time">{formatTime(currentTime)}</span>
          <div
            className="player-page__progress"
            ref={progressRef}
            onClick={handleProgressClick}
          >
            <div
              className="player-page__progress-fill"
              style={{ width: `${progress}%` }}
            />
            <div
              className="player-page__progress-thumb"
              style={{ left: `${progress}%` }}
            />
          </div>
          <span className="player-page__time">{formatTime(duration)}</span>
        </div>

        <div className="player-page__controls">
          <button className="player-page__btn player-page__btn--small" title="Shuffle">
            <Shuffle size={20} />
          </button>

          <button
            className="player-page__btn"
            onClick={handlePrevSong}
            title="Previous Song"
          >
            <SkipBack size={24} />
          </button>

          <button
            className="player-page__btn player-page__btn--small"
            onClick={() => skip(-5)}
            title="Back 5s"
          >
            <ChevronsLeft size={24} />
          </button>

          <button
            className="player-page__btn player-page__btn--play"
            onClick={togglePlay}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause fill="currentColor" size={32} /> : <Play fill="currentColor" size={32} />}
          </button>

          <button
            className="player-page__btn player-page__btn--small"
            onClick={() => skip(5)}
            title="Forward 5s"
          >
            <ChevronsRight size={24} />
          </button>

          <button
            className="player-page__btn"
            onClick={handleNextSong}
            title="Next Song"
          >
            <SkipForward size={24} />
          </button>

          <button className="player-page__btn player-page__btn--small" title="Repeat">
            <Repeat size={20} />
          </button>
        </div>

        <div className="player-page__bottom-sheet">
          <div className="player-page__bottom-sheet-handle"></div>
          <SimilarTracks onSelectSong={goToSong} />
          <Comments songId={id} />
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;