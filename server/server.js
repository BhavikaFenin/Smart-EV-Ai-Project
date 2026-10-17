require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const batteryRoutes = require("./routes/batteryRoutes");
const stationRoutes = require("./routes/stationRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const routePlannerRoutes = require("./routes/routePlannerRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/battery", batteryRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/route", routePlannerRoutes);
app.use("/api/admin", adminRoutes);

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
