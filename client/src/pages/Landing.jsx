import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const features = [
  { icon: "🔋", title: "AI Battery Prediction", desc: "Predicts battery health, failure risk, and remaining useful life using a Random Forest model." },
  { icon: "🗺️", title: "Charging Station Finder", desc: "Locate nearby stations with live availability, pricing, and charger types." },
  { icon: "📅", title: "Slot Booking", desc: "Reserve charging slots in advance and skip the wait." },
  { icon: "🚗", title: "Smart Route Planner", desc: "Get EV-friendly routes with charging stops when your range falls short." },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="inline-block bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          AI-Powered EV Companion
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
          Drive smarter with your <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">Smart EV Assistant</span>
        </h1>
        <p className="text-slate-500 mt-5 max-w-2xl mx-auto">
          Predict battery failures before they happen, find and book charging stations in seconds,
          and plan EV-friendly routes with confidence.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Link to={user ? "/dashboard" : "/register"} className="btn-primary">
            {user ? "Go to Dashboard" : "Get Started Free"}
          </Link>
          <Link to="/login" className="btn-outline">Log In</Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((f) => (
          <div key={f.title} className="card text-center">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-semibold text-slate-800 mb-1">{f.title}</h3>
            <p className="text-sm text-slate-500">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
