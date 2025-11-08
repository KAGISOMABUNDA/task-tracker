import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  // Strong password regex
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!strongPasswordRegex.test(formData.password)) {
    setError(
      "Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
    );
    setLoading(false);
    return;
  }

  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );

    // Create user profile in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      photoURL: null,
      createdAt: new Date().toISOString(),
    });

    navigate("/");
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8 py-8">
      <form
        onSubmit={handleRegister}
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
            Create Account
          </h2>
          <p className="text-sm text-slate-500 mt-2">Start tracking your tasks today</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="Steve"
              className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400 text-sm sm:text-base"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Jobs"
              className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400 text-sm sm:text-base"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

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
            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400 text-sm sm:text-base"
            value={formData.email}
            onChange={handleChange}
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
            autoComplete="new-password"
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400 text-sm sm:text-base"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
          />
          <p className="text-xs text-slate-500 mt-1">Password must be at least 8 characters, uppercase, lowercase, number, & special character.</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed px-4 py-2.5 rounded-lg text-white font-medium transition-colors duration-150 text-sm sm:text-base"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-sm text-slate-600 mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}