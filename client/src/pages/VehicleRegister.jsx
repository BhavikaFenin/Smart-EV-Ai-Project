import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function VehicleRegister() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    make: "",
    model: "",
    registrationNumber: "",
    batteryCapacityKwh: "",
    currentRangeKm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadVehicles = async () => {
    const { data } = await api.get("/vehicles");
    setVehicles(data);
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/vehicles", {
        ...form,
        batteryCapacityKwh: Number(form.batteryCapacityKwh),
        currentRangeKm: Number(form.currentRangeKm) || 0,
      });
      setForm({ make: "", model: "", registrationNumber: "", batteryCapacityKwh: "", currentRangeKm: "" });
      loadVehicles();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add vehicle");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/vehicles/${id}`);
    loadVehicles();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">My Vehicles</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold text-slate-800 mb-4">Register a new EV</h2>
          {error && <div className="mb-4 text-sm bg-rose-50 text-rose-600 px-4 py-2 rounded-lg">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input name="make" required placeholder="Make (e.g. Tata)" className="input-field" value={form.make} onChange={handleChange} />
            <input name="model" required placeholder="Model (e.g. Nexon EV)" className="input-field" value={form.model} onChange={handleChange} />
            <input name="registrationNumber" required placeholder="Registration Number" className="input-field" value={form.registrationNumber} onChange={handleChange} />
            <input name="batteryCapacityKwh" required type="number" placeholder="Battery Capacity (kWh)" className="input-field" value={form.batteryCapacityKwh} onChange={handleChange} />
            <input name="currentRangeKm" type="number" placeholder="Current Range (km)" className="input-field" value={form.currentRangeKm} onChange={handleChange} />
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Saving..." : "Add Vehicle"}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {vehicles.length === 0 && (
            <div className="card text-slate-500 text-sm">No vehicles registered yet.</div>
          )}
          {vehicles.map((v) => (
            <div key={v._id} className="card flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-800">{v.make} {v.model}</p>
                <p className="text-sm text-slate-500">{v.registrationNumber}</p>
                <p className="text-sm text-slate-500 mt-1">{v.batteryCapacityKwh} kWh · {v.currentRangeKm} km range</p>
              </div>
              <button onClick={() => handleDelete(v._id)} className="text-rose-500 text-sm font-medium hover:underline">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
