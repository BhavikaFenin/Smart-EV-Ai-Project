const express = require("express");
const router = express.Router();
const { getAll, getNearby, create, update, remove } = require("../controllers/stationController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", getAll);
router.get("/nearby", getNearby);
router.post("/", protect, adminOnly, create);
router.put("/:id", protect, adminOnly, update);
router.delete("/:id", protect, adminOnly, remove);

module.exports = router;
