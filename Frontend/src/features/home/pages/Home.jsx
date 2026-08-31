import { useState } from "react";
import { Link } from "react-router";
import { Plus, LogOut, Upload as UploadIcon } from "lucide-react";
import FaceExpression from "../../Expression/components/FaceExpressions";
import SearchBar from "../components/SearchBar";
import RecentlyPlayed from "../components/RecentlyPlayed";
import CuratedPlaylists from "../components/CuratedPlaylists";
import { useSong } from "../hooks/useSong";
import { useAuth } from "../../auth/hooks/useAuth";
import AudiomLogo from "../../../components/AudiomLogo";
import { motion } from "motion/react";

const Home = () => {
  const { handleGetSong, goToSong, error } = useSong();
  const { user, handleLogOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="min-h-screen bg-[#121212] text-[#ffffff] font-sans selection:bg-[#699fff]/30 selection:text-[#699fff] pb-24">
      {/* Top Navigation Bar: Transparent / solid #121212 */}
      <header className="sticky top-0 z-50 w-full bg-[#121212]/95 backdrop-blur-md border-b border-[#303030] px-4 sm:px-8 py-3">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
          {/* Left: Wordmark + Waveform mark */}
          <Link to="/" className="flex items-center gap-2.5 text-decoration-none shrink-0 group">
            <AudiomLogo />
            <span className="text-[18px] font-bold text-white tracking-tight group-hover:text-[#699fff] transition-colors">
              Audiom
            </span>
          </Link>

          {/* Center: Discovery Search Input */}
          <div className="flex-1 max-w-xl mx-4">
            <SearchBar onSelectSong={goToSong} />
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Primary Filled White Button (4px radius, #ffffff bg, #121212 text) */}
            <Link to="/upload" className="btn-primary">
              <UploadIcon size={14} />
              <span>Upload your own</span>
            </Link>

            {/* Auth status / Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-8 h-8 rounded-[4px] bg-[#303030] hover:bg-[#404040] text-xs font-bold text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  {(user.username || "U").slice(0, 2).toUpperCase()}
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-10 w-48 bg-[#1e1e1e] border border-[#303030] rounded-[4px] p-2 z-50 shadow-2xl">
                    <div className="px-3 py-2 border-b border-[#303030] mb-1">
                      <p className="text-xs font-bold text-white truncate">{user.username}</p>
                      <p className="text-[11px] text-[#999999] truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#ff6666] hover:bg-[#303030] rounded-[4px] text-left cursor-pointer transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary">
                  Create account
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container Max-Width 1200px */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-10 sm:pt-14 flex flex-col gap-16">
        {/* Error Feedback */}
        {error && (
          <div className="bg-[#303030] border border-[#ff4444] text-[#ff8888] text-sm font-semibold rounded-[4px] p-4 text-center">
            {error}
          </div>
        )}

        {/* Hero Section: Editorial Display Headline at weight 100 */}
        <section className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-[60px] font-thin text-white tracking-tight leading-tight mb-4">
            Connect on Audiom
          </h1>
          <p className="text-base sm:text-[17px] text-[#999999] max-w-xl mb-8 leading-relaxed">
            Discover, stream, and share a constantly expanding mix of music synchronized with your real-time emotion.
          </p>

          {/* Biometric Emotion Vision Scanner */}
          <FaceExpression onClick={(expression) => handleGetSong({ mood: expression })} />
        </section>

        {/* 6-Column Curated Playlists & Free Music Streams */}
        <CuratedPlaylists onSelectSong={goToSong} />

        {/* 6-Column Recently Played / Trending Section */}
        <section>
          <RecentlyPlayed onSelectSong={goToSong} />
        </section>
      </main>
    </div>
  );
};

export default Home;