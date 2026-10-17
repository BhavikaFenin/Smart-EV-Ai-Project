import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/axios";

const statusClass = {
  Booked: "badge-healthy",
  Cancelled: "badge-critical",
  Completed: "badge-warning",
};

export default function Booking() {
  const location = useLocation();
  const [vehicles, setVehicles] = useState([]);
  const [stations, setStations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    vehicleId: "",
    stationId: location.state?.stationId || "",
    slotDate: "",
    slotTime: "",
  });

  const loadAll = async () => {
    const [{ data: v }, { data: s }, { data: b }] = await Promise.all([
      api.get("/vehicles"),
      api.get("/stations"),
      api.get("/bookings/mine"),
    ]);
    setVehicles(v);
    setStations(s);
    setBookings(b);
    setForm((f) => ({
      ...f,
      vehicleId: f.vehicleId || v[0]?._id || "",
      stationId: f.stationId || s[0]?._id || "",
    }));
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/bookings", form);
      setForm({ ...form, slotDate: "", slotTime: "" });
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    await api.put(`/bookings/${id}/cancel`);
    loadAll();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Charging Slot Booking</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold text-slate-800 mb-4">Book a slot</h2>
          {error && <div className="mb-4 text-sm bg-rose-50 text-rose-600 px-4 py-2 rounded-lg">{error}</div>}
          {vehicles.length === 0 || stations.length === 0 ? (
            <p className="text-sm text-slate-500">You need at least one registered vehicle to book a slot.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <select name="vehicleId" className="input-field" value={form.vehicleId} onChange={handleChange}>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>{v.make} {v.model}</option>
                ))}
              </select>
              <select name="stationId" className="input-field" value={form.stationId} onChange={handleChange}>
                {stations.map((s) => (
                  <option key={s._id} value={s._id}>{s.name} ({s.availableSlots} slots left)</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input type="date" name="slotDate" required className="input-field" value={form.slotDate} onChange={handleChange} />
                <input type="time" name="slotTime" required className="input-field" value={form.slotTime} onChange={handleChange} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
            </form>
          )}
        </div>

        <div>
          <h2 className="font-semibold text-slate-800 mb-4">My Bookings</h2>
          <div className="space-y-3">
            {bookings.length === 0 && <div className="card text-sm text-slate-500">No bookings yet.</div>}
            {bookings.map((b) => (
              <div key={b._id} className="card flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{b.station?.name}</p>
                  <p className="text-sm text-slate-500">
                    {new Date(b.slotDate).toLocaleDateString()} at {b.slotTime} · {b.vehicle?.registrationNumber}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={statusClass[b.status]}>{b.status}</span>
                  {b.status === "Booked" && (
                    <button onClick={() => handleCancel(b._id)} className="text-rose-500 text-sm font-medium hover:underline">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
