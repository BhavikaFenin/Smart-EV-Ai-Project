const User = require("../models/User");
const Booking = require("../models/Booking");
const BatteryPrediction = require("../models/BatteryPrediction");
const ChargingStation = require("../models/ChargingStation");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const [userCount, stationCount, bookingCount, predictions] = await Promise.all([
      User.countDocuments(),
      ChargingStation.countDocuments(),
      Booking.countDocuments(),
      BatteryPrediction.find(),
    ]);

    const statusBreakdown = predictions.reduce(
      (acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
      },
      { Healthy: 0, Warning: 0, Critical: 0 }
    );

    res.json({
      userCount,
      stationCount,
      bookingCount,
      predictionCount: predictions.length,
      statusBreakdown,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
