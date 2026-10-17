const ChargingStation = require("../models/ChargingStation");

// Haversine distance in km
function distanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

exports.getAll = async (req, res) => {
  try {
    const stations = await ChargingStation.find();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNearby = async (req, res) => {
  try {
    const { lat, lng, radiusKm = 15 } = req.query;
    if (!lat || !lng) return res.status(400).json({ message: "lat and lng are required" });

    const stations = await ChargingStation.find();
    const nearby = stations
      .map((s) => ({
        ...s.toObject(),
        distanceKm: Math.round(distanceKm(Number(lat), Number(lng), s.latitude, s.longitude) * 10) / 10,
      }))
      .filter((s) => s.distanceKm <= Number(radiusKm))
      .sort((a, b) => a.distanceKm - b.distanceKm);

    res.json(nearby);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const station = await ChargingStation.create(req.body);
    res.status(201).json(station);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const station = await ChargingStation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(station);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await ChargingStation.findByIdAndDelete(req.params.id);
    res.json({ message: "Station removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
