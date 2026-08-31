import { useState } from "react";
import { Link } from "react-router";
import {
  UploadCloud,
  ArrowLeft,
  FolderOpen,
  CheckCircle,
  Loader2,
  Music,
} from "lucide-react";
import { useUpload } from "../hooks/useUpload";
import AudiomLogo from "../../../components/AudiomLogo";
import confetti from "canvas-confetti";

const MOODS = [
  { key: "happy", label: "Happy" },
  { key: "energetic", label: "Energetic" },
  { key: "sad", label: "Sad" },
  { key: "chill", label: "Chill" },
  { key: "surprised", label: "Surprised" },
];

const Upload = () => {
  const { loading, error, success, handleUpload } = useUpload();

  const [file, setFile] = useState(null);
  const [mood, setMood] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;

    const ok = await handleUpload({ file, mood });
    if (ok) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#ffffff", "#699fff", "#999999"],
      });
      setFile(null);
      setMood("");
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 MB";
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#ffffff] font-sans selection:bg-[#699fff]/30 selection:text-[#699fff] pb-20">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full bg-[#121212]/95 backdrop-blur-md border-b border-[#303030] px-4 sm:px-8 py-3">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 text-decoration-none group">
            <AudiomLogo />
            <span className="text-[18px] font-bold text-white tracking-tight group-hover:text-[#699fff] transition-colors">
              Audiom
            </span>
          </Link>

          <Link to="/" className="btn-ghost">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to stream</span>
          </Link>
        </div>
      </header>

      {/* Main Studio Canvas */}
      <main className="max-w-xl mx-auto px-4 pt-10 sm:pt-14">
        <div className="bg-[#1e1e1e] border border-[#303030] rounded-[4px] p-6 sm:p-8">
          {/* Header Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">
              Upload your own track
            </h1>
            <p className="text-xs text-[#999999]">
              Provide audio master files (MP3, WAV, FLAC, M4A up to 150MB)
            </p>
          </div>

          {/* Error Feedback */}
          {error && (
            <div className="bg-[#303030] border border-[#ff4444] text-[#ff8888] text-xs font-semibold rounded-[4px] p-3 mb-4 text-center">
              {error}
            </div>
          )}

          {/* Success Feedback */}
          {success && (
            <div className="bg-[#303030] border border-white text-white text-xs font-semibold rounded-[4px] p-3 mb-4 text-center flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-white" />
              <span>Track uploaded successfully to your catalog!</span>
            </div>
          )}

          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Dropzone Container */}
            <div className="space-y-1.5">
              <label htmlFor="song-file" className="block text-xs font-semibold text-[#999999] uppercase tracking-wider">
                Audio Master File
              </label>

              <div className="relative border border-dashed border-[#555555] hover:border-white bg-[#303030] rounded-[4px] p-6 flex flex-col items-center justify-center cursor-pointer text-center transition-colors">
                <input
                  id="song-file"
                  type="file"
                  accept="audio/mpeg,audio/mp3,audio/wav,audio/flac,audio/m4a"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                />

                <FolderOpen className="w-8 h-8 text-[#999999] mb-2" />

                {file ? (
                  <div className="flex flex-col items-center gap-1 z-20">
                    <div className="inline-flex items-center gap-2 text-white font-semibold text-xs">
                      <Music className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[220px]">{file.name}</span>
                    </div>
                    <span className="text-[11px] text-[#999999] font-mono">
                      {formatFileSize(file.size)} • Click to replace
                    </span>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-white mb-0.5">
                      Choose audio file to upload
                    </p>
                    <p className="text-xs text-[#999999]">
                      Drag and drop here or click to browse
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Mood Classification */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#999999] uppercase tracking-wider">
                Mood Tag (Optional)
              </label>

              <div className="grid grid-cols-3 gap-2">
                {MOODS.map((m) => {
                  const isSelected = mood === m.key;
                  return (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setMood(isSelected ? "" : m.key)}
                      className={`py-2 px-3 rounded-[4px] text-xs font-semibold transition-colors cursor-pointer capitalize ${
                        isSelected
                          ? "bg-white text-[#121212]"
                          : "bg-[#303030] text-[#999999] hover:text-white"
                      }`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Flat White Submit Button */}
            <button
              type="submit"
              disabled={loading || !file}
              className="btn-primary w-full py-3 mt-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#121212]" />
                  <span>Processing Upload…</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload track</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Upload;