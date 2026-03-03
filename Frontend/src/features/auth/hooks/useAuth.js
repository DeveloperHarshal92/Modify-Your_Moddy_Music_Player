import { useContext, useEffect } from "react";
import { login, register, getMe, logOut } from "../services/auth.api";
import { AuthContext } from "../context/auth.context";

export const useAuth = () => {
  const context = useContext(AuthContext);

  const { user, setuser, loading, setLoading } = context;

  async function handleRegister({ username, email, password }) {
    setLoading(true);
    const data = await register({ username, email, password });
    setuser(data.user);
    setLoading(false);
  }
  async function handleLogin({ username, email, password }) {
    setLoading(true);
    const data = await login({ username, email, password });
    setuser(data.user);
    setLoading(false);
  }

  async function handleGetMe() {
    setLoading(true);
    const data = await getMe();
    setuser(data.user);
    setLoading(false);
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
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogOut,
  };
};
