const express = require("express");
const router = express.Router();
const { addVehicle, getMyVehicles, deleteVehicle } = require("../controllers/vehicleController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.post("/", addVehicle);
router.get("/", getMyVehicles);
router.delete("/:id", deleteVehicle);

module.exports = router;
