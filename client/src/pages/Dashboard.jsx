import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import api from "../api/axios";

const badgeClass = {
  Healthy: "badge-healthy",
  Warning: "badge-warning",
  Critical: "badge-critical",
};

export default function Dashboard() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [history, setHistory] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("/vehicles").then(({ data }) => setVehicles(data));
    api.get("/battery/history").then(({ data }) => setHistory(data));
    api.get("/bookings/mine").then(({ data }) => setBookings(data));
  }, []);

  const latest = history[0];
  const upcoming = bookings.filter((b) => b.status === "Booked");

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
      <p className="text-slate-500 mb-8">Here's what's happening with your EV today.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Registered Vehicles" value={vehicles.length} icon="🚗" accent="primary" />
        <StatCard
          label="Latest Battery Status"
          value={latest ? latest.status : "—"}
          sub={latest ? `${latest.soh}% health` : "No predictions yet"}
          icon="🔋"
          accent="accent"
        />
        <StatCard label="Upcoming Bookings" value={upcoming.length} icon="📅" accent="primary" />
        <StatCard label="Total Predictions Run" value={history.length} icon="🤖" accent="accent" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h2 className="font-semibold text-slate-800 mb-4">Recent Battery Predictions</h2>
          {history.length === 0 ? (
            <p className="text-sm text-slate-500">
              No predictions yet.{" "}
              <Link to="/battery" className="text-primary-600 font-medium">Run your first prediction →</Link>
            </p>
          ) : (
            <div className="space-y-3">
              {history.slice(0, 5).map((h) => (
                <div key={h._id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{h.vehicle?.make} {h.vehicle?.model}</p>
                    <p className="text-xs text-slate-400">{new Date(h.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={badgeClass[h.status]}>{h.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="font-semibold text-slate-800 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/vehicles" className="btn-outline w-full block text-center">+ Register Vehicle</Link>
            <Link to="/battery" className="btn-outline w-full block text-center">Run Battery Check</Link>
            <Link to="/stations" className="btn-outline w-full block text-center">Find Charging Station</Link>
            <Link to="/route-planner" className="btn-outline w-full block text-center">Plan a Trip</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
