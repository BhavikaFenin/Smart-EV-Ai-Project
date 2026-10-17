const Vehicle = require("../models/Vehicle");

exports.addVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create({ ...req.body, owner: req.user.id });
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user.id });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    await Vehicle.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    res.json({ message: "Vehicle removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
