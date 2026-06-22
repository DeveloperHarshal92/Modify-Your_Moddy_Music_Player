import { useState } from "react";
import { useNavigate } from "react-router";
import { useUpload } from "../hooks/useUpload";
import "../style/upload.scss";

const MOOD_OPTIONS = ["happy", "sad", "surprised"];

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
        <h1 className="upload-card__title">Upload a song</h1>
        <p className="upload-card__subtitle">
          Add a new track to Moodify. Title and cover art are read from the file automatically.
        </p>

        {error && <div className="upload-card__error">{error}</div>}
        {success && (
          <div className="upload-card__success">
            Song uploaded successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="upload-form__group">
            <label htmlFor="song-file">Song file (MP3)</label>
            <input
              id="song-file"
              type="file"
              accept="audio/mpeg,audio/mp3"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>

          <div className="upload-form__group">
            <label htmlFor="mood">Mood</label>
            <select
              id="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a mood
              </option>
              {MOOD_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button className="upload-form__submit" type="submit" disabled={loading}>
            {loading ? "Uploading…" : "Upload song"}
          </button>
        </form>

        <button className="upload-card__back" onClick={() => navigate("/")}>
          ← Back to home
        </button>
      </div>
    </main>
  );
};

export default Upload;