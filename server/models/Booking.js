const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    station: { type: mongoose.Schema.Types.ObjectId, ref: "ChargingStation", required: true },
    slotDate: { type: Date, required: true },
    slotTime: { type: String, required: true },
    status: { type: String, enum: ["Booked", "Cancelled", "Completed"], default: "Booked" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
