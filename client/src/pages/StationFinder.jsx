import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function StationFinder() {
  const [stations, setStations] = useState([]);
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState("Locating you...");

  const loadNearby = (lat, lng) => {
    api.get("/stations/nearby", { params: { lat, lng, radiusKm: 25 } }).then(({ data }) => {
      setStations(data);
      setStatus(data.length ? "" : "No stations found nearby.");
    });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCoords({ lat: latitude, lng: longitude });
          loadNearby(latitude, longitude);
        },
        () => {
          // fallback: Jaipur coordinates
          setCoords({ lat: 26.9124, lng: 75.7873 });
          loadNearby(26.9124, 75.7873);
        }
      );
    } else {
      setCoords({ lat: 26.9124, lng: 75.7873 });
      loadNearby(26.9124, 75.7873);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Nearby Charging Stations</h1>
        {coords && (
          <span className="text-sm text-slate-500">
            Showing results near {coords.lat.toFixed(3)}, {coords.lng.toFixed(3)}
          </span>
        )}
      </div>

      {status && <p className="text-sm text-slate-500 mb-4">{status}</p>}

      <div className="grid md:grid-cols-2 gap-5">
        {stations.map((s) => (
          <div key={s._id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-800">{s.name}</h3>
                <p className="text-sm text-slate-500">{s.address}</p>
              </div>
              <span className="badge-healthy">★ {s.rating}</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
              <div>
                <p className="text-slate-400">Distance</p>
                <p className="font-semibold text-slate-800">{s.distanceKm} km</p>
              </div>
              <div>
                <p className="text-slate-400">Price</p>
                <p className="font-semibold text-slate-800">₹{s.pricePerKwh}/kWh</p>
              </div>
              <div>
                <p className="text-slate-400">Slots</p>
                <p className="font-semibold text-slate-800">{s.availableSlots}/{s.totalSlots}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              {s.chargerTypes.map((t) => (
                <span key={t} className="text-xs font-medium bg-accent-400/10 text-accent-600 px-2.5 py-1 rounded-full">
                  {t}
                </span>
              ))}
            </div>

            <Link
              to="/bookings"
              state={{ stationId: s._id, stationName: s.name }}
              className="btn-primary w-full mt-4 text-center block"
            >
              Book a Slot
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
