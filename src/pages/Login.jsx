import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 sm:p-8 lg:p-10 rounded-xl w-full max-w-md shadow-sm border border-slate-200"
        autoComplete="on"
      >
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl items-center justify-center mb-4">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-500 mt-2">Log in to continue tracking</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 sm:py-3 rounded-lg bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400 text-sm sm:text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full px-4 py-2.5 sm:py-3 rounded-lg bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400 text-sm sm:text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 px-4 py-2.5 sm:py-3 rounded-lg text-white font-medium transition-colors duration-150 text-sm sm:text-base"
        >
          Log In
        </button>

        <p className="text-sm text-slate-600 mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}