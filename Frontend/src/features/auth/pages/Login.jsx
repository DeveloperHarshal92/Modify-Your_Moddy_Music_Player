import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { Mail, Lock, Loader2 } from "lucide-react";
import AudiomLogo from "../../../components/AudiomLogo";

const Login = () => {
  const { loading, error, handleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const success = await handleLogin({ email, password });
    if (success) {
      navigate("/");
    }
  }

  return (
    <main className="min-h-screen w-full flex flex-col justify-center items-center px-4 py-12 bg-[#121212] text-[#ffffff] font-sans selection:bg-[#699fff]/30 selection:text-[#699fff]">
      <div className="w-full max-w-md bg-[#1e1e1e] border border-[#303030] rounded-[4px] p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4 text-decoration-none group">
            <AudiomLogo />
            <span className="text-[18px] font-bold text-white tracking-tight group-hover:text-[#699fff] transition-colors">
              Audiom
            </span>
          </Link>

          <h1 className="text-2xl font-semibold text-white mb-1 tracking-tight">
            Sign in to your account
          </h1>
          <p className="text-[#999999] text-xs">
            Enter your credentials to access your audio catalog.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-[#303030] border border-[#ff4444] text-[#ff8888] text-xs font-semibold rounded-[4px] px-3 py-2.5 mb-4">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email Field */}
          <div className="space-y-1">
            <label htmlFor="login-email" className="text-xs font-semibold text-[#999999] uppercase tracking-wider">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
              required
              className="input-dark w-full"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label htmlFor="login-password" className="text-xs font-semibold text-[#999999] uppercase tracking-wider">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="input-dark w-full"
            />
          </div>

          {/* Flat White Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 mt-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#121212]" />
                <span>Signing in…</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-[#999999] text-xs mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#699fff] font-semibold hover:underline ml-1">
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;