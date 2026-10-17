import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Welcome back</h1>
        <p className="text-slate-500 mb-6">Log in to your Smart EV Assistant account</p>

        {error && (
          <div className="mb-4 text-sm bg-rose-50 text-rose-600 px-4 py-2 rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600">Email</label>
            <input
              type="email"
              name="email"
              required
              className="input-field mt-1"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Password</label>
            <input
              type="password"
              name="password"
              required
              className="input-field mt-1"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary-600 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
