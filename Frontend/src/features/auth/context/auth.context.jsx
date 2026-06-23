import { createContext, useState, useEffect } from "react";
import { getMe } from "../services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setuser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchMe() {
      try {
        const data = await getMe();
        if (isMounted) setuser(data.user);
      } catch (err) {
        if (isMounted) setuser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchMe();
    return () => { isMounted = false; };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setuser, loading, setLoading, error, setError }}
    >
      {children}
    </AuthContext.Provider>
  );
};