const mongoose = require("mongoose");

const batteryPredictionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    voltage: { type: Number, required: true },
    temperature: { type: Number, required: true },
    chargingCycles: { type: Number, required: true },
    batteryAgeMonths: { type: Number, required: true },
    soh: { type: Number, required: true },
    status: { type: String, enum: ["Healthy", "Warning", "Critical"], required: true },
    confidence: { type: Number },
    healthPercentage: { type: Number },
    remainingUsefulLifeCycles: { type: Number },
    suggestions: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("BatteryPrediction", batteryPredictionSchema);
