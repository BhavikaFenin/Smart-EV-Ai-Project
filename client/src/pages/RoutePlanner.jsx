import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function RoutePlanner() {
  const [vehicles, setVehicles] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    vehicleId: "",
    originLat: "26.9124",
    originLng: "75.7873",
    destLat: "26.8388",
    destLng: "75.8067",
    currentRangeKm: "150",
  });

  useEffect(() => {
    api.get("/vehicles").then(({ data }) => {
      setVehicles(data);
      if (data.length) setForm((f) => ({ ...f, vehicleId: data[0]._id, currentRangeKm: data[0].currentRangeKm || f.currentRangeKm }));
    });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post("/route/plan", {
        originLat: Number(form.originLat),
        originLng: Number(form.originLng),
        destLat: Number(form.destLat),
        destLng: Number(form.destLng),
        currentRangeKm: Number(form.currentRangeKm),
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Route planning failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Smart EV Route Planner</h1>
      <p className="text-slate-500 mb-6 text-sm">
        Enter coordinates for now — plug in the Google Places Autocomplete API to let users search by place name.
      </p>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-3">
            {vehicles.length > 0 && (
              <select name="vehicleId" className="input-field" value={form.vehicleId} onChange={handleChange}>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>{v.make} {v.model}</option>
                ))}
              </select>
            )}
            <p className="text-xs font-semibold text-slate-500 pt-1">Origin</p>
            <div className="grid grid-cols-2 gap-3">
              <input name="originLat" type="number" step="any" className="input-field" value={form.originLat} onChange={handleChange} placeholder="Latitude" />
              <input name="originLng" type="number" step="any" className="input-field" value={form.originLng} onChange={handleChange} placeholder="Longitude" />
            </div>
            <p className="text-xs font-semibold text-slate-500 pt-1">Destination</p>
            <div className="grid grid-cols-2 gap-3">
              <input name="destLat" type="number" step="any" className="input-field" value={form.destLat} onChange={handleChange} placeholder="Latitude" />
              <input name="destLng" type="number" step="any" className="input-field" value={form.destLng} onChange={handleChange} placeholder="Longitude" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Current Battery Range (km)</label>
              <input name="currentRangeKm" type="number" className="input-field mt-1" value={form.currentRangeKm} onChange={handleChange} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Planning..." : "Plan Route"}
            </button>
          </form>
        </div>

        <div>
          {error && <div className="mb-4 text-sm bg-rose-50 text-rose-600 px-4 py-2 rounded-lg">{error}</div>}
          {result && (
            <div className="space-y-4">
              <div className="card grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Trip Distance</p>
                  <p className="font-semibold text-slate-800 text-lg">{result.tripDistanceKm} km</p>
                </div>
                <div>
                  <p className="text-slate-400">Estimated Time</p>
                  <p className="font-semibold text-slate-800 text-lg">{result.estimatedMinutes} min</p>
                </div>
                <div>
                  <p className="text-slate-400">Battery Usage</p>
                  <p className="font-semibold text-slate-800 text-lg">{result.batteryConsumptionEstimatePercent}%</p>
                </div>
                <div>
                  <p className="text-slate-400">Feasible on Current Charge</p>
                  <p className={`font-semibold text-lg ${result.feasibleWithCurrentRange ? "text-primary-600" : "text-rose-500"}`}>
                    {result.feasibleWithCurrentRange ? "Yes" : "No — charging needed"}
                  </p>
                </div>
              </div>

              {!result.feasibleWithCurrentRange && (
                <div className="card">
                  <h3 className="font-semibold text-slate-800 mb-3">Recommended Charging Stops</h3>
                  {result.recommendedChargingStops.length === 0 ? (
                    <p className="text-sm text-slate-500">No suitable charging stations found along this route.</p>
                  ) : (
                    <div className="space-y-3">
                      {result.recommendedChargingStops.map((s) => (
                        <div key={s.id} className="flex items-center justify-between bg-primary-50 rounded-xl px-4 py-3">
                          <div>
                            <p className="font-medium text-slate-800 text-sm">{s.name}</p>
                            <p className="text-xs text-slate-500">{s.address}</p>
                          </div>
                          <span className="text-xs font-semibold text-primary-600">+{s.detourKm} km detour</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
