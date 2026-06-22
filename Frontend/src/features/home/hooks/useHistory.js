import { useState, useEffect, useCallback } from "react";
import { getRecentlyPlayed } from "../service/history.api";

export const useHistory = () => {
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRecentlyPlayed();
      setRecent(data.recent);
    } catch (err) {
      console.error("Failed to fetch recently played:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { recent, loading, refresh };
};