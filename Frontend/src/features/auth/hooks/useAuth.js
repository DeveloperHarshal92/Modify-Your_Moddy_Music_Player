import { useContext, useEffect } from "react";
import { login, register, getMe, logOut } from "../services/auth.api";
import { AuthContext } from "../context/auth.context";

export const useAuth = () => {
  const context = useContext(AuthContext);

  const { user, setuser, loading, setLoading, error, setError } = context;

  async function handleRegister({ username, email, password }) {
    setLoading(true);
    setError(null);
    try {
      const data = await register({ username, email, password });
      setuser(data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin({ username, email, password }) {
    setLoading(true);
    setError(null);
    try {
      const data = await login({ username, email, password });
      setuser(data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleGetMe() {
    setLoading(true);
    try {
      const data = await getMe();
      setuser(data.user);
    } catch (err) {
      // 401 here just means "no one is logged in yet" — not a real error
      setuser(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogOut() {
    setLoading(true);
    const data = await logOut();
    setuser(null);
    setLoading(false);
  }

  useEffect(() => {
    handleGetMe();
  }, []);

  return {
    user,
    loading,
    error,
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogOut,
  };
};