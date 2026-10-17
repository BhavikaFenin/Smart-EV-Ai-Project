import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">⚡</span>
          <span className="font-bold text-lg text-slate-800">Smart<span className="text-primary-600">EV</span></span>
        </Link>

        {user ? (
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/dashboard" className="hover:text-primary-600">Dashboard</Link>
            <Link to="/battery" className="hover:text-primary-600">Battery</Link>
            <Link to="/stations" className="hover:text-primary-600">Stations</Link>
            <Link to="/bookings" className="hover:text-primary-600">Bookings</Link>
            <Link to="/route-planner" className="hover:text-primary-600">Route Planner</Link>
            {user.role === "admin" && (
              <Link to="/admin" className="hover:text-primary-600">Admin</Link>
            )}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <span className="text-slate-500">Hi, {user.name?.split(" ")[0]}</span>
              <button onClick={handleLogout} className="btn-outline !py-1.5 !px-4 text-sm">
                Logout
              </button>
            </div>
          </nav>
        ) : (
          <nav className="flex items-center gap-3">
            <Link to="/login" className="btn-outline !py-1.5 !px-4 text-sm">Login</Link>
            <Link to="/register" className="btn-primary !py-1.5 !px-4 text-sm">Get Started</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
