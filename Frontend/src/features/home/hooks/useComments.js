import { useState, useEffect, useCallback } from "react";
import { getComments, postComment } from "../service/comment.api";

export const useComments = (songId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!songId) return;
    setLoading(true);
    try {
      const data = await getComments(songId);
      setComments(data.comments);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setLoading(false);
    }
  }, [songId]);

  async function addComment(text) {
    if (!text || text.trim().length === 0) return false;

    setPosting(true);
    setError(null);
    try {
      const data = await postComment(songId, text.trim());
      setComments((prev) => [data.comment, ...prev]);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post comment.");
      return false;
    } finally {
      setPosting(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { comments, loading, posting, error, addComment };
};