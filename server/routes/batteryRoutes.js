const express = require("express");
const router = express.Router();
const { predict, history, latestForVehicle } = require("../controllers/batteryController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.post("/predict", predict);
router.get("/history", history);
router.get("/latest/:vehicleId", latestForVehicle);

module.exports = router;
