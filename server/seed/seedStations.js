require("dotenv").config();
const mongoose = require("mongoose");
const ChargingStation = require("../models/ChargingStation");

const sampleStations = [
  {
    name: "Jaipur Central EV Hub",
    address: "MI Road, Jaipur, Rajasthan",
    latitude: 26.9124,
    longitude: 75.7873,
    chargerTypes: ["AC", "DC", "Fast"],
    pricePerKwh: 12,
    totalSlots: 6,
    availableSlots: 4,
    rating: 4.5,
  },
  {
    name: "Malviya Nagar Charging Point",
    address: "Malviya Nagar, Jaipur, Rajasthan",
    latitude: 26.8534,
    longitude: 75.8039,
    chargerTypes: ["AC", "Fast"],
    pricePerKwh: 10,
    totalSlots: 4,
    availableSlots: 2,
    rating: 4.2,
  },
  {
    name: "Vaishali Nagar Fast Charge",
    address: "Vaishali Nagar, Jaipur, Rajasthan",
    latitude: 26.9155,
    longitude: 75.7377,
    chargerTypes: ["DC", "Fast"],
    pricePerKwh: 14,
    totalSlots: 8,
    availableSlots: 8,
    rating: 4.7,
  },
  {
    name: "Ajmer Highway Station",
    address: "Ajmer Road, Jaipur, Rajasthan",
    latitude: 26.8925,
    longitude: 75.6558,
    chargerTypes: ["DC", "Fast"],
    pricePerKwh: 13,
    totalSlots: 5,
    availableSlots: 3,
    rating: 4.0,
  },
  {
    name: "Tonk Road EV Station",
    address: "Tonk Road, Jaipur, Rajasthan",
    latitude: 26.8388,
    longitude: 75.8067,
    chargerTypes: ["AC", "DC"],
    pricePerKwh: 11,
    totalSlots: 4,
    availableSlots: 1,
    rating: 3.9,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await ChargingStation.deleteMany({});
  await ChargingStation.insertMany(sampleStations);
  console.log(`Seeded ${sampleStations.length} charging stations`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
