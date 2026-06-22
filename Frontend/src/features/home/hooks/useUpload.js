import { useState } from "react";
import { uploadSong } from "../service/song.api";

export const useUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleUpload({ file, mood }) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!file) {
      setError("Please select a song file.");
      setLoading(false);
      return false;
    }

    if (!mood) {
      setError("Please select a mood.");
      setLoading(false);
      return false;
    }

    try {
      await uploadSong({ file, mood });
      setSuccess(true);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, success, handleUpload };
};