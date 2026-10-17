const express = require("express");
const router = express.Router();
const { createBooking, myBookings, cancelBooking, allBookings } = require("../controllers/bookingController");
const { protect, adminOnly } = require("../middleware/auth");

router.use(protect);
router.post("/", createBooking);
router.get("/mine", myBookings);
router.put("/:id/cancel", cancelBooking);
router.get("/all", adminOnly, allBookings);

module.exports = router;
