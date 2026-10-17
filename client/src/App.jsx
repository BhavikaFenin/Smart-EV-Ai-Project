import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import VehicleRegister from "./pages/VehicleRegister";
import BatteryPrediction from "./pages/BatteryPrediction";
import StationFinder from "./pages/StationFinder";
import Booking from "./pages/Booking";
import RoutePlanner from "./pages/RoutePlanner";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/vehicles" element={<ProtectedRoute><VehicleRegister /></ProtectedRoute>} />
        <Route path="/battery" element={<ProtectedRoute><BatteryPrediction /></ProtectedRoute>} />
        <Route path="/stations" element={<ProtectedRoute><StationFinder /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/route-planner" element={<ProtectedRoute><RoutePlanner /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}
