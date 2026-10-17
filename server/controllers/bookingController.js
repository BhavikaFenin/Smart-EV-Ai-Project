const Booking = require("../models/Booking");
const ChargingStation = require("../models/ChargingStation");

exports.createBooking = async (req, res) => {
  try {
    const { vehicleId, stationId, slotDate, slotTime } = req.body;

    const station = await ChargingStation.findById(stationId);
    if (!station) return res.status(404).json({ message: "Station not found" });
    if (station.availableSlots <= 0) {
      return res.status(400).json({ message: "No slots available at this station" });
    }

    const booking = await Booking.create({
      user: req.user.id,
      vehicle: vehicleId,
      station: stationId,
      slotDate,
      slotTime,
    });

    station.availableSlots -= 1;
    await station.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.myBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("station", "name address chargerTypes pricePerKwh")
      .populate("vehicle", "make model registrationNumber")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status === "Cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    booking.status = "Cancelled";
    await booking.save();

    const station = await ChargingStation.findById(booking.station);
    if (station) {
      station.availableSlots = Math.min(station.totalSlots, station.availableSlots + 1);
      await station.save();
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.allBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("station", "name")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
