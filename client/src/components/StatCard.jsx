import React from "react";

export default function StatCard({ label, value, sub, accent = "primary", icon }) {
  const accentClasses = {
    primary: "from-primary-500 to-primary-400",
    accent: "from-accent-500 to-accent-400",
  };

  return (
    <div className="card flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accentClasses[accent]} flex items-center justify-center text-white text-xl shrink-0`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
