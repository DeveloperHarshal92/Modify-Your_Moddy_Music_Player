import { useState } from "react";
import { PUBLIC_PLAYLISTS, PUBLIC_TRACKS } from "../data/publicMusicCatalog";
import { Play } from "lucide-react";
import { motion } from "motion/react";

const MOOD_FILTERS = [
  { key: "all", label: "All" },
  { key: "chill", label: "Chill" },
  { key: "energetic", label: "Energy" },
  { key: "happy", label: "Uplifting" },
  { key: "sad", label: "Melancholy" },
  { key: "surprised", label: "Ambient" },
];

export default function CuratedPlaylists({ onSelectSong }) {
  const [activeMood, setActiveMood] = useState("all");

  const filteredTracks = activeMood === "all"
    ? PUBLIC_TRACKS
    : PUBLIC_TRACKS.filter((t) => t.mood.toLowerCase() === activeMood.toLowerCase());

  const filteredPlaylists = activeMood === "all"
    ? PUBLIC_PLAYLISTS
    : PUBLIC_PLAYLISTS.filter((p) => p.mood.toLowerCase() === activeMood.toLowerCase());

  return (
    <section className="w-full flex flex-col gap-12">
      {/* Section 1: Featured Playlists (6-column layout) */}
      <div>
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#303030]">
          <h2 className="text-[22px] font-semibold text-white tracking-tight">
            Featured Mood Playlists
          </h2>
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {MOOD_FILTERS.map((tab) => {
              const isActive = activeMood === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveMood(tab.key)}
                  className={`px-3 py-1 text-xs font-semibold rounded-[4px] transition-colors cursor-pointer ${
                    isActive
                      ? "bg-white text-[#121212]"
                      : "text-[#999999] hover:text-white bg-[#303030]/50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6-column Playlist Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {filteredPlaylists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => {
                const track = PUBLIC_TRACKS.find((t) => t.mood === pl.mood) || PUBLIC_TRACKS[0];
                onSelectSong(track._id);
              }}
              className="group cursor-pointer flex flex-col"
            >
              {/* 1:1 Aspect Thumbnail */}
              <div className="relative aspect-square w-full rounded-[4px] overflow-hidden bg-[#303030] mb-3">
                <img
                  src={pl.coverUrl}
                  alt={pl.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-[4px] bg-white text-[#121212] flex items-center justify-center shadow-lg">
                    <Play size={18} fill="currentColor" className="ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Bare Container Metadata */}
              <h3 className="text-sm font-semibold text-white truncate group-hover:underline">
                {pl.title}
              </h3>
              <p className="text-xs text-[#999999] truncate capitalize mt-0.5">
                {pl.mood} • {pl.tracksCount} tracks
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Trending Free Tracks Grid (6-column layout) */}
      <div>
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#303030]">
          <div>
            <h2 className="text-[22px] font-semibold text-white tracking-tight">
              Hear what's trending in the Audiom community
            </h2>
            <p className="text-xs text-[#999999] mt-0.5">
              Free lossless stream tracks curated by mood and rhythm
            </p>
          </div>
        </div>

        {/* 6-column Track Cards with 1:1 aspect art */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {filteredTracks.map((song) => (
            <div
              key={song._id}
              onClick={() => onSelectSong(song._id)}
              className="group cursor-pointer flex flex-col"
            >
              {/* 1:1 Aspect Cover Art */}
              <div className="relative aspect-square w-full rounded-[4px] overflow-hidden bg-[#303030] mb-3">
                <img
                  src={song.posterUrl}
                  alt={song.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-9 h-9 rounded-[4px] bg-white text-[#121212] flex items-center justify-center shadow-lg">
                    <Play size={16} fill="currentColor" className="ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Title & Artist */}
              <h4 className="text-sm font-semibold text-white truncate group-hover:underline">
                {song.title}
              </h4>
              <p className="text-xs text-[#999999] truncate mt-0.5">
                {song.artist}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

