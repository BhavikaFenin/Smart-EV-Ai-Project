import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import api from "../api/axios";

export default function Admin() {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [stations, setStations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", address: "", latitude: "", longitude: "",
    chargerTypes: "AC,DC", pricePerKwh: "", totalSlots: "4",
  });

  const loadAll = async () => {
    const [{ data: a }, { data: u }, { data: s }, { data: b }] = await Promise.all([
      api.get("/admin/analytics"),
      api.get("/admin/users"),
      api.get("/stations"),
      api.get("/bookings/all"),
    ]);
    setAnalytics(a);
    setUsers(u);
    setStations(s);
    setBookings(b);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddStation = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/stations", {
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        pricePerKwh: Number(form.pricePerKwh),
        totalSlots: Number(form.totalSlots),
        availableSlots: Number(form.totalSlots),
        chargerTypes: form.chargerTypes.split(",").map((s) => s.trim()),
      });
      setForm({ name: "", address: "", latitude: "", longitude: "", chargerTypes: "AC,DC", pricePerKwh: "", totalSlots: "4" });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add station");
    }
  };

  const handleDeleteStation = async (id) => {
    await api.delete(`/stations/${id}`);
    loadAll();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Admin Dashboard</h1>

      {analytics && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard label="Total Users" value={analytics.userCount} icon="👥" accent="primary" />
          <StatCard label="Charging Stations" value={analytics.stationCount} icon="⚡" accent="accent" />
          <StatCard label="Total Bookings" value={analytics.bookingCount} icon="📅" accent="primary" />
          <StatCard
            label="Critical Batteries"
            value={analytics.statusBreakdown.Critical}
            sub={`${analytics.statusBreakdown.Healthy} healthy · ${analytics.statusBreakdown.Warning} warning`}
            icon="⚠️"
            accent="accent"
          />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h2 className="font-semibold text-slate-800 mb-4">Add Charging Station</h2>
          {error && <div className="mb-4 text-sm bg-rose-50 text-rose-600 px-4 py-2 rounded-lg">{error}</div>}
          <form onSubmit={handleAddStation} className="space-y-3">
            <input name="name" required placeholder="Station name" className="input-field" value={form.name} onChange={handleChange} />
            <input name="address" required placeholder="Address" className="input-field" value={form.address} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-3">
              <input name="latitude" required type="number" step="any" placeholder="Latitude" className="input-field" value={form.latitude} onChange={handleChange} />
              <input name="longitude" required type="number" step="any" placeholder="Longitude" className="input-field" value={form.longitude} onChange={handleChange} />
            </div>
            <input name="chargerTypes" placeholder="Charger types (comma separated: AC,DC,Fast)" className="input-field" value={form.chargerTypes} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-3">
              <input name="pricePerKwh" required type="number" placeholder="Price / kWh" className="input-field" value={form.pricePerKwh} onChange={handleChange} />
              <input name="totalSlots" required type="number" placeholder="Total slots" className="input-field" value={form.totalSlots} onChange={handleChange} />
            </div>
            <button type="submit" className="btn-primary w-full">Add Station</button>
          </form>
        </div>

        <div className="card overflow-auto max-h-[420px]">
          <h2 className="font-semibold text-slate-800 mb-4">Manage Stations</h2>
          <div className="space-y-3">
            {stations.map((s) => (
              <div key={s._id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-700">{s.name}</p>
                  <p className="text-xs text-slate-400">{s.availableSlots}/{s.totalSlots} slots · ₹{s.pricePerKwh}/kWh</p>
                </div>
                <button onClick={() => handleDeleteStation(s._id)} className="text-rose-500 text-sm font-medium hover:underline">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card overflow-auto max-h-[360px]">
          <h2 className="font-semibold text-slate-800 mb-4">Users</h2>
          <div className="space-y-2">
            {users.map((u) => (
              <div key={u._id} className="flex items-center justify-between text-sm border-b border-slate-100 pb-2 last:border-0">
                <span className="text-slate-700">{u.name}</span>
                <span className="text-slate-400">{u.email}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card overflow-auto max-h-[360px]">
          <h2 className="font-semibold text-slate-800 mb-4">All Bookings</h2>
          <div className="space-y-2">
            {bookings.map((b) => (
              <div key={b._id} className="flex items-center justify-between text-sm border-b border-slate-100 pb-2 last:border-0">
                <span className="text-slate-700">{b.user?.name} → {b.station?.name}</span>
                <span className="text-slate-400">{b.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
