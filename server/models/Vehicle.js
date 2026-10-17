const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    batteryCapacityKwh: { type: Number, required: true },
    purchaseDate: { type: Date },
    currentRangeKm: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
