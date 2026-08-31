import { useEffect, useRef, useState, useMemo } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  X,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Activity,
  MessageSquare,
  ListMusic,
  Sparkles,
} from "lucide-react";
import { useSong } from "../hooks/useSong";
import { useHistory } from "../hooks/useHistory";
import { PUBLIC_TRACKS } from "../data/publicMusicCatalog";
import SimilarTracks from "../components/SimilarTracks";
import Comments from "../components/Comments";
import Loader from "../../../components/Loader";
import { motion, AnimatePresence } from "motion/react";
import "../style/playerPage.scss";

const formatTime = (seconds) => {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

const MOOD_GRADIENTS = {
  happy: "radial-gradient(circle at 50% 35%, rgba(242, 178, 60, 0.45), transparent 60%), radial-gradient(circle at 65% 65%, rgba(16, 185, 129, 0.2), transparent 55%), #090a0a",
  energetic: "radial-gradient(circle at 50% 35%, rgba(255, 107, 74, 0.45), transparent 60%), radial-gradient(circle at 65% 65%, rgba(242, 178, 60, 0.2), transparent 55%), #090a0a",
  sad: "radial-gradient(circle at 50% 35%, rgba(95, 163, 224, 0.4), transparent 60%), radial-gradient(circle at 65% 65%, rgba(56, 217, 169, 0.15), transparent 55%), #090a0a",
  chill: "radial-gradient(circle at 50% 35%, rgba(16, 185, 129, 0.4), transparent 60%), radial-gradient(circle at 65% 65%, rgba(95, 163, 224, 0.15), transparent 55%), #090a0a",
  surprised: "radial-gradient(circle at 50% 35%, rgba(176, 146, 232, 0.45), transparent 60%), radial-gradient(circle at 65% 65%, rgba(255, 107, 74, 0.15), transparent 55%), #090a0a",
};

const PlayerPage = () => {
  const { id } = useParams();
  const { song, similar, loading, error, loadSongById, goToSong } = useSong();
  const { recent } = useHistory();

  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const canvasRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumePopover, setShowVolumePopover] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState(null); // 'comments' | 'queue' | 'visualizer' | null

  useEffect(() => {
    if (id) loadSongById(id);
  }, [id]);

  const activeAudioUrl = song?.url || song?.audioUrl;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [activeAudioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Playback interrupted:", err));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e) => {
    const bar = progressRef.current;
    if (!bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = ratio * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };

  const handleSongEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    handleNextSong();
  };

  const handleNextSong = () => {
    if (similar && similar.length > 0) {
      goToSong(similar[0]._id);
    } else {
      const other = PUBLIC_TRACKS.find((t) => t._id !== song?._id) || PUBLIC_TRACKS[0];
      goToSong(other._id);
    }
  };

  const handlePrevSong = () => {
    if (recent && recent.length > 0) {
      if (recent[0]?.song?._id === song?._id && recent.length > 1) {
        goToSong(recent[1].song._id);
      } else if (recent[0]?.song?._id) {
        goToSong(recent[0].song._id);
      }
    } else {
      const other = PUBLIC_TRACKS.find((t) => t._id !== song?._id) || PUBLIC_TRACKS[0];
      goToSong(other._id);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    audioRef.current.muted = newMuteState;
  };

  // Build a 5-item list for 3D Carousel rendering
  const carouselList = useMemo(() => {
    if (!song) return [];

    const currentCard = {
      _id: song._id,
      title: song.title,
      artist: song.artist || song.mood || "Audiom",
      posterUrl: song.posterUrl,
    };

    const nextItems = (similar || []).map((s) => ({
      _id: s._id,
      title: s.title,
      artist: s.artist || s.mood || "Audiom",
      posterUrl: s.posterUrl,
    }));

    const prevItems = (recent || [])
      .map((r) => r.song)
      .filter((s) => s && s._id !== song._id)
      .map((s) => ({
        _id: s._id,
        title: s.title,
        artist: s.artist || s.mood || "Audiom",
        posterUrl: s.posterUrl,
      }));

    const publicFallbacks = PUBLIC_TRACKS.map((t) => ({
      _id: t._id,
      title: t.title,
      artist: t.artist,
      posterUrl: t.posterUrl,
    }));

    const pool = [...prevItems, ...nextItems, ...publicFallbacks];
    const uniquePool = pool.filter(
      (item, idx, self) => item._id !== currentCard._id && self.findIndex((t) => t._id === item._id) === idx
    );

    const left1 = uniquePool[0] || currentCard;
    const left2 = uniquePool[1] || uniquePool[0] || currentCard;
    const right1 = uniquePool[2] || uniquePool[0] || currentCard;
    const right2 = uniquePool[3] || uniquePool[1] || right1;

    return [left2, left1, currentCard, right1, right2];
  }, [song, similar, recent]);

  const centerIndex = 2;

  // Live Canvas Visualizer Animation
  useEffect(() => {
    if (activeDrawer !== "visualizer" || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;

    const bars = 48;
    const barWidth = canvas.width / bars;

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < bars; i++) {
        const height = isPlaying
          ? Math.sin(Date.now() / 200 + i * 0.4) * 35 + 45 + Math.random() * 20
          : 6;

        const x = i * barWidth;
        const y = (canvas.height - height) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + height);
        gradient.addColorStop(0, "#53e076");
        gradient.addColorStop(1, "#1db954");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x + 2, y, barWidth - 4, height, 4);
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [activeDrawer, isPlaying]);

  if (loading && !song) {
    return <Loader message="Tuning in to your audio stream…" />;
  }

  if (error) {
    return (
      <div className="player-status-container">
        <p className="text-red-400 font-bold mb-4">{error}</p>
        <Link to="/" className="player-back-btn">
          <ArrowLeft size={16} />
          <span>Return Home</span>
        </Link>
      </div>
    );
  }

  if (!song) return null;

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const moodKey = (song.mood || "").toLowerCase();
  const ambientBg =
    MOOD_GRADIENTS[moodKey] ||
    "radial-gradient(circle at 50% 35%, rgba(242, 140, 40, 0.45), transparent 55%), radial-gradient(circle at 65% 65%, rgba(83, 224, 118, 0.15), transparent 60%), #090a0a";

  return (
    <div className="player-stage">
      {/* Ambient background and vignette */}
      <div className="ambient" style={{ background: ambientBg }} />
      <div className="vignette" />

      {/* Top Header Navigation */}
      <div className="player-nav-header">
        <Link to="/" className="player-back-btn">
          <ArrowLeft size={16} />
          <span>Home</span>
        </Link>

        {song.mood && (
          <div className="player-mood-pill">
            <Sparkles size={13} />
            <span>{song.mood} Vibe</span>
          </div>
        )}
      </div>

      {/* Audio element supporting both local and public audio streams */}
      <audio
        ref={audioRef}
        src={activeAudioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleSongEnd}
      />

      {/* 3D Cover Art Carousel */}
      <div className="carousel-wrap">
        <div className="track">
          {carouselList.map((item, i) => {
            const offset = i - centerIndex;
            const abs = Math.abs(offset);

            if (abs > 2) return null;

            const tx = offset * 145;
            const rot = offset * -28;
            const scale = offset === 0 ? 1 : 0.82;
            const z = -abs * 140;

            const cardStyle = {
              opacity: 1,
              pointerEvents: "auto",
              transform: `translateX(${tx}px) translateZ(${z}px) rotateY(${rot}deg) scale(${scale})`,
              filter: offset === 0 ? "none" : `blur(${abs * 1.5}px) brightness(${1 - abs * 0.2})`,
              zIndex: 10 - abs,
              backgroundImage: `url(${item.posterUrl})`,
            };

            const isCenter = offset === 0;

            const handleCardClick = () => {
              if (isCenter) return;
              if (item._id && !item._id.startsWith("mock")) {
                goToSong(item._id);
              } else if (offset < 0) {
                handlePrevSong();
              } else if (offset > 0) {
                handleNextSong();
              }
            };

            return (
              <motion.div
                key={`${item._id}-${i}`}
                className={`card ${isCenter ? "active" : ""}`}
                style={cardStyle}
                onClick={handleCardClick}
                whileHover={isCenter ? { scale: 1.02 } : { scale: 0.86 }}
                transition={{ duration: 0.3 }}
              >
                <div className="fade" />
                <div className="meta">
                  <p className="title">{item.title}</p>
                  <p className="artist">{item.artist}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Floating Glassmorphism Player Pill (Reference Image Architecture) */}
      <div className="pill-container">
        <div className="pill">
          {/* Left Zone: Transport Controls */}
          <div className="pill-zone-controls">
            <button
              className="ctrl-btn"
              aria-label="Previous track"
              onClick={handlePrevSong}
              title="Previous Track"
            >
              <SkipBack size={20} />
            </button>

            <button
              className="play-btn-large"
              aria-label="Play or Pause"
              onClick={togglePlay}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={20} fill="currentColor" />
              ) : (
                <Play size={20} fill="currentColor" className="ml-0.5" />
              )}
            </button>

            <button
              className="ctrl-btn"
              aria-label="Next track"
              onClick={handleNextSong}
              title="Next Track"
            >
              <SkipForward size={20} />
            </button>
          </div>

          {/* Center Zone: Inset Track Island with mini scrubber */}
          <div className="pill-zone-track">
            <div
              className="pill-thumb"
              style={{ backgroundImage: `url(${song.posterUrl})` }}
            />
            <div className="pill-meta">
              <div className="flex items-center justify-between gap-2">
                <span className="t" title={song.title}>
                  {song.title}
                </span>
                <span className="pill-time">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="a">{song.artist || song.mood || "Audiom"}</span>
              </div>
              {/* Interactive Progress Bar Scrubber */}
              <div
                className="pill-scrubber mt-1"
                ref={progressRef}
                onClick={handleProgressClick}
                title="Seek position"
              >
                <i style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          {/* Right Zone: Additional Feature Buttons */}
          <div className="pill-zone-actions">
            {/* Visualizer Toggle */}
            <button
              aria-label="Audio Visualizer"
              className={`action-btn ${activeDrawer === "visualizer" ? "active-toggle" : ""}`}
              onClick={() => setActiveDrawer(activeDrawer === "visualizer" ? null : "visualizer")}
              title="Audio Visualizer"
            >
              <Activity size={18} />
            </button>

            {/* Comments Toggle */}
            <button
              aria-label="Reviews and Comments"
              className={`action-btn ${activeDrawer === "comments" ? "active-toggle" : ""}`}
              onClick={() => setActiveDrawer(activeDrawer === "comments" ? null : "comments")}
              title="Reviews & Discussions"
            >
              <MessageSquare size={18} />
            </button>

            {/* Queue / Similar Tracks Toggle */}
            <button
              aria-label="Up Next and Queue"
              className={`action-btn ${activeDrawer === "queue" ? "active-toggle" : ""}`}
              onClick={() => setActiveDrawer(activeDrawer === "queue" ? null : "queue")}
              title="Queue & Similar Tracks"
            >
              <ListMusic size={18} />
            </button>

            {/* Volume Button & Popover */}
            <button
              aria-label="Volume"
              className={`action-btn ${showVolumePopover ? "active-toggle" : ""}`}
              onClick={() => setShowVolumePopover(!showVolumePopover)}
              title="Volume Control"
            >
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            {/* Volume Slider Popover */}
            {showVolumePopover && (
              <div className="volume-popover">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-[#53e076] transition-colors p-0 border-none bg-none cursor-pointer"
                >
                  {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                />
                <span>{Math.round((isMuted ? 0 : volume) * 100)}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Touch Hint */}
        <span className="hint">Tap side cards to seamlessly switch tracks</span>
      </div>

      {/* Slide-over Drawers for Comments, Queue, and Visualizer */}
      <AnimatePresence>
        {activeDrawer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="player-drawer-overlay"
            onClick={() => setActiveDrawer(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="player-drawer"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="player-drawer-header">
                <h3>
                  {activeDrawer === "comments" && "Reviews & Community Pulse"}
                  {activeDrawer === "queue" && "Up Next & Similar Vibes"}
                  {activeDrawer === "visualizer" && "Live Frequency Spectrum"}
                </h3>
                <button onClick={() => setActiveDrawer(null)} aria-label="Close Drawer">
                  <X size={16} />
                </button>
              </div>

              {activeDrawer === "comments" && <Comments songId={id} />}
              {activeDrawer === "queue" && (
                <SimilarTracks
                  onSelectSong={(selectedId) => {
                    goToSong(selectedId);
                    setActiveDrawer(null);
                  }}
                />
              )}
              {activeDrawer === "visualizer" && (
                <div className="flex flex-col items-center gap-4 py-4 text-center">
                  <canvas ref={canvasRef} width={600} height={120} className="visualizer-canvas" />
                  <p className="text-xs font-semibold text-[#9aa39a]">
                    Real-time equalizer synthesis for <strong className="text-white">{song.title}</strong>
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlayerPage;