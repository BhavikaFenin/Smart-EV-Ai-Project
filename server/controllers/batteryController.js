const BatteryPrediction = require("../models/BatteryPrediction");
const { predictBatteryHealth } = require("../utils/mlBridge");

exports.predict = async (req, res) => {
  try {
    const { vehicleId, voltage, temperature, chargingCycles, batteryAgeMonths, soh } = req.body;

    if (
      [voltage, temperature, chargingCycles, batteryAgeMonths, soh].some(
        (v) => v === undefined || v === null
      )
    ) {
      return res.status(400).json({ message: "All battery parameters are required" });
    }

    const result = await predictBatteryHealth({
      voltage,
      temperature,
      chargingCycles,
      batteryAgeMonths,
      soh,
    });

    const record = await BatteryPrediction.create({
      user: req.user.id,
      vehicle: vehicleId,
      voltage,
      temperature,
      chargingCycles,
      batteryAgeMonths,
      soh,
      status: result.status,
      confidence: result.confidence,
      healthPercentage: result.health_percentage,
      remainingUsefulLifeCycles: result.remaining_useful_life_cycles,
      suggestions: result.suggestions,
    });

    res.status(201).json({ prediction: record, details: result });
  } catch (err) {
    res.status(500).json({ message: "Prediction failed", error: err.message });
  }
};

exports.history = async (req, res) => {
  try {
    const records = await BatteryPrediction.find({ user: req.user.id })
      .populate("vehicle", "make model registrationNumber")
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.latestForVehicle = async (req, res) => {
  try {
    const record = await BatteryPrediction.findOne({
      user: req.user.id,
      vehicle: req.params.vehicleId,
    }).sort({ createdAt: -1 });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
