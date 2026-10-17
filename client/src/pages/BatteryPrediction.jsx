import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../api/axios";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const badgeClass = {
  Healthy: "badge-healthy",
  Warning: "badge-warning",
  Critical: "badge-critical",
};

export default function BatteryPrediction() {
  const [vehicles, setVehicles] = useState([]);
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    vehicleId: "",
    voltage: "3.7",
    temperature: "30",
    chargingCycles: "300",
    batteryAgeMonths: "12",
    soh: "88",
  });

  const loadData = async () => {
    const [{ data: v }, { data: h }] = await Promise.all([
      api.get("/vehicles"),
      api.get("/battery/history"),
    ]);
    setVehicles(v);
    setHistory(h);
    if (v.length && !form.vehicleId) setForm((f) => ({ ...f, vehicleId: v[0]._id }));
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post("/battery/predict", {
        vehicleId: form.vehicleId,
        voltage: Number(form.voltage),
        temperature: Number(form.temperature),
        chargingCycles: Number(form.chargingCycles),
        batteryAgeMonths: Number(form.batteryAgeMonths),
        soh: Number(form.soh),
      });
      setResult(data.details);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: history.slice(0, 10).reverse().map((h) => new Date(h.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: "State of Health (%)",
        data: history.slice(0, 10).reverse().map((h) => h.soh),
        borderColor: "#0fa968",
        backgroundColor: "rgba(15,169,104,0.15)",
        tension: 0.35,
        fill: true,
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">AI Battery Health Prediction</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold text-slate-800 mb-4">Run a prediction</h2>
          {error && <div className="mb-4 text-sm bg-rose-50 text-rose-600 px-4 py-2 rounded-lg">{error}</div>}
          {vehicles.length === 0 ? (
            <p className="text-sm text-slate-500">Register a vehicle first to run predictions.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <select name="vehicleId" className="input-field" value={form.vehicleId} onChange={handleChange}>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>{v.make} {v.model} ({v.registrationNumber})</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-500">Voltage (V)</label>
                  <input name="voltage" type="number" step="0.01" className="input-field mt-1" value={form.voltage} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Temperature (°C)</label>
                  <input name="temperature" type="number" className="input-field mt-1" value={form.temperature} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Charging Cycles</label>
                  <input name="chargingCycles" type="number" className="input-field mt-1" value={form.chargingCycles} onChange={handleChange} />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Battery Age (months)</label>
                  <input name="batteryAgeMonths" type="number" className="input-field mt-1" value={form.batteryAgeMonths} onChange={handleChange} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-slate-500">State of Health (%)</label>
                  <input name="soh" type="number" className="input-field mt-1" value={form.soh} onChange={handleChange} />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Analyzing..." : "Predict Battery Health"}
              </button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          {result && (
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-slate-800">Prediction Result</h2>
                <span className={badgeClass[result.status]}>{result.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Health</p>
                  <p className="font-semibold text-slate-800">{result.health_percentage}%</p>
                </div>
                <div>
                  <p className="text-slate-400">Confidence</p>
                  <p className="font-semibold text-slate-800">{result.confidence}%</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-400">Estimated Remaining Useful Life</p>
                  <p className="font-semibold text-slate-800">{result.remaining_useful_life_cycles} charge cycles</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-slate-600 mb-2">Suggestions</p>
                <ul className="space-y-1.5">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-primary-500">•</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div className="card">
              <h2 className="font-semibold text-slate-800 mb-4">Health Trend</h2>
              <Line data={chartData} options={{ plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100 } } }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
