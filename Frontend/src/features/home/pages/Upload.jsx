import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { UploadCloud, Upload as UploadIcon, ArrowLeft } from "lucide-react";
import { useUpload } from "../hooks/useUpload";
import "../style/upload.scss";

const MOOD_OPTIONS = ["happy", "sad", "surprised", "chill", "energetic"];

const Upload = () => {
  const { loading, error, success, handleUpload } = useUpload();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [mood, setMood] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await handleUpload({ file, mood });
    if (ok) {
      setFile(null);
      setMood("");
    }
  }

  return (
    <main className="upload-page">
      <div className="upload-card">
        <div className="upload-card__header">
          <div className="upload-card__icon">
            <UploadCloud size={32} color="#dd4200" />
          </div>
          <h1 className="upload-card__title">Upload a song</h1>
          <p className="upload-card__subtitle">
            Title and cover art are read automatically from file metadata.
          </p>
        </div>

        {error && (
          <div className="upload-card__error">
            <div className="upload-card__error-text">{error}</div>
          </div>
        )}
        {success && (
          <div className="upload-card__success">
            <div className="upload-card__success-text">Song uploaded successfully!</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="upload-form__group">
            <label htmlFor="song-file">Audio File</label>
            <div className="upload-form__file-wrapper">
              <input
                id="song-file"
                type="file"
                accept="audio/mpeg,audio/mp3,audio/wav,audio/flac"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
                className="sr-only"
              />
              <label htmlFor="song-file" className="upload-form__file-label">
                <span className="upload-form__file-button">Choose file</span>
                <span className={`upload-form__file-name ${file ? 'has-file' : ''}`}>
                  {file ? file.name : "No file chosen"}
                </span>
              </label>
            </div>
            <p className="upload-form__help-text">Supports MP3, WAV, FLAC</p>
          </div>

          <div className="upload-form__group">
            <label htmlFor="mood">Initial Mood Tag (Optional)</label>
            <select
              id="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="upload-form__select"
            >
              <option value="" disabled>Select a vibe...</option>
              {MOOD_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button className="upload-form__submit" type="submit" disabled={loading}>
            <UploadIcon size={20} />
            {loading ? "Uploading…" : "Upload Song"}
          </button>
        </form>

        <div className="upload-card__footer">
          <Link to="/" className="upload-card__back">
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Upload;