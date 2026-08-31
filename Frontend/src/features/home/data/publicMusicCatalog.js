// Curated public lossless streaming music catalog for Audiom
// Royalty-free tracks with CDN-hosted audio and artwork

export const PUBLIC_PLAYLISTS = [
  {
    id: "pl-chill-lofi",
    title: "Midnight Lo-Fi Echoes",
    mood: "chill",
    tagline: "Slow-tempo beats for deep focus and late-night calm",
    coverUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
    tracksCount: 3,
  },
  {
    id: "pl-synthwave",
    title: "Cyberpunk Neon Overdrive",
    mood: "energetic",
    tagline: "High-octane synthwave and electronic velocity",
    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
    tracksCount: 3,
  },
  {
    id: "pl-happy-groove",
    title: "Golden Hour Symphony",
    mood: "happy",
    tagline: "Uplifting acoustic melodies and radiant acoustic vibes",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
    tracksCount: 3,
  },
  {
    id: "pl-sad-piano",
    title: "Midnight Rain & Solitude",
    mood: "sad",
    tagline: "Cinematic piano textures and ambient melancholy",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
    tracksCount: 2,
  },
  {
    id: "pl-ambient-zen",
    title: "Deep Space Atmosphere",
    mood: "surprised",
    tagline: "Ethereal soundscapes and experimental frequencies",
    coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80",
    tracksCount: 2,
  },
];

export const PUBLIC_TRACKS = [
  // Chill / Lofi
  {
    _id: "pub-chill-01",
    title: "Tokyo Rain Reverie",
    artist: "Lofi Dreamer",
    mood: "chill",
    duration: 164,
    durationText: "2:44",
    posterUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
    plays: "148.2k",
    isPublic: true,
  },
  {
    _id: "pub-chill-02",
    title: "Coffee & Cozy Blankets",
    artist: "Aura Sound",
    mood: "chill",
    duration: 182,
    durationText: "3:02",
    posterUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chill-abstract-intention-12099.mp3",
    plays: "92.5k",
    isPublic: true,
  },
  {
    _id: "pub-chill-03",
    title: "Autumn Breeze Waltz",
    artist: "Zenith Lofi",
    mood: "chill",
    duration: 145,
    durationText: "2:25",
    posterUrl: "https://images.unsplash.com/photo-1445307806294-bff7f67ff225?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=lofi-chill-medium-version-159456.mp3",
    plays: "67.1k",
    isPublic: true,
  },

  // Energetic / Synth
  {
    _id: "pub-energy-01",
    title: "Neon Horizon Drive",
    artist: "Synthwave Collective",
    mood: "energetic",
    duration: 210,
    durationText: "3:30",
    posterUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/24/audio_386faee718.mp3?filename=electronic-future-beats-117997.mp3",
    plays: "215.8k",
    isPublic: true,
  },
  {
    _id: "pub-energy-02",
    title: "Solar Velocity",
    artist: "Kinetics",
    mood: "energetic",
    duration: 195,
    durationText: "3:15",
    posterUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/26/audio_d0c6ff1101.mp3?filename=sport-cyberpunk-synthwave-11222.mp3",
    plays: "178.4k",
    isPublic: true,
  },
  {
    _id: "pub-energy-03",
    title: "Cybernetic Pulse",
    artist: "Glitch Grid",
    mood: "energetic",
    duration: 178,
    durationText: "2:58",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2021/11/24/audio_65cf25de12.mp3?filename=the-cradle-of-your-soul-15700.mp3",
    plays: "134.0k",
    isPublic: true,
  },

  // Happy / Uplifting
  {
    _id: "pub-happy-01",
    title: "Golden Hour Glow",
    artist: "Sunlight Acoustics",
    mood: "happy",
    duration: 160,
    durationText: "2:40",
    posterUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/04/27/audio_30b615d862.mp3?filename=happy-day-113985.mp3",
    plays: "190.1k",
    isPublic: true,
  },
  {
    _id: "pub-happy-02",
    title: "Positive Horizons",
    artist: "Joy Project",
    mood: "happy",
    duration: 142,
    durationText: "2:22",
    posterUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/02/10/audio_fc86fae852.mp3?filename=uplifting-day-112704.mp3",
    plays: "112.3k",
    isPublic: true,
  },
  {
    _id: "pub-happy-03",
    title: "Sunny Side Steps",
    artist: "Morning Breeze",
    mood: "happy",
    duration: 155,
    durationText: "2:35",
    posterUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c3504343b9.mp3?filename=summer-uplifting-pop-112192.mp3",
    plays: "88.7k",
    isPublic: true,
  },

  // Sad / Melancholy
  {
    _id: "pub-sad-01",
    title: "Piano in the Mist",
    artist: "Nocturne Noir",
    mood: "sad",
    duration: 198,
    durationText: "3:18",
    posterUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_18c4e09886.mp3?filename=sad-piano-ambient-110825.mp3",
    plays: "205.4k",
    isPublic: true,
  },
  {
    _id: "pub-sad-02",
    title: "Distant Reminiscence",
    artist: "Silhouettes",
    mood: "sad",
    duration: 175,
    durationText: "2:55",
    posterUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_24f575231c.mp3?filename=melancholy-ambient-11910.mp3",
    plays: "94.6k",
    isPublic: true,
  },

  // Surprised / Ambient
  {
    _id: "pub-surp-01",
    title: "Interstellar Mirage",
    artist: "Cosmic Odyssey",
    mood: "surprised",
    duration: 220,
    durationText: "3:40",
    posterUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/16/audio_c8bfb0ff72.mp3?filename=space-ambient-meditation-112836.mp3",
    plays: "140.9k",
    isPublic: true,
  },
  {
    _id: "pub-surp-02",
    title: "Quantum Drift",
    artist: "Ethereal Realm",
    mood: "surprised",
    duration: 188,
    durationText: "3:08",
    posterUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&auto=format&fit=crop&q=80",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/02/07/audio_d0862024b4.mp3?filename=ambient-piano-calm-108740.mp3",
    plays: "81.2k",
    isPublic: true,
  },
];

export function getPublicSongByMood(mood) {
  if (!mood) return PUBLIC_TRACKS[0];
  const matching = PUBLIC_TRACKS.filter(
    (t) => t.mood.toLowerCase() === mood.toLowerCase()
  );
  if (matching.length === 0) return PUBLIC_TRACKS[0];
  return matching[Math.floor(Math.random() * matching.length)];
}

export function getPublicSongById(id) {
  return PUBLIC_TRACKS.find((t) => t._id === id) || null;
}

export function getPublicSimilarSongs(songId, limit = 8) {
  const current = getPublicSongById(songId);
  if (!current) return PUBLIC_TRACKS.slice(0, limit);
  const matching = PUBLIC_TRACKS.filter(
    (t) => t._id !== songId && t.mood === current.mood
  );
  const others = PUBLIC_TRACKS.filter(
    (t) => t._id !== songId && t.mood !== current.mood
  );
  return [...matching, ...others].slice(0, limit);
}

export function searchPublicTracks(query) {
  if (!query || query.trim() === "") return PUBLIC_TRACKS.slice(0, 8);
  const q = query.toLowerCase().trim();
  return PUBLIC_TRACKS.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      t.mood.toLowerCase().includes(q)
  );
}
