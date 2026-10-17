const mongoose = require("mongoose");

const chargingStationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    chargerTypes: [{ type: String, enum: ["AC", "DC", "Fast"] }],
    pricePerKwh: { type: Number, required: true },
    totalSlots: { type: Number, required: true, default: 4 },
    availableSlots: { type: Number, required: true, default: 4 },
    rating: { type: Number, default: 4.0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChargingStation", chargingStationSchema);
