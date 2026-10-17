const ChargingStation = require("../models/ChargingStation");

function toRad(v) {
  return (v * Math.PI) / 180;
}

function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Simplified EV route planner.
 * NOTE: This uses straight-line distance as an approximation. For production use,
 * replace with the Google Directions API to get real driving distance/time/polyline,
 * and plug charging-station candidates along that route's waypoints.
 */
exports.planRoute = async (req, res) => {
  try {
    const { originLat, originLng, destLat, destLng, currentRangeKm } = req.body;
    if ([originLat, originLng, destLat, destLng, currentRangeKm].some((v) => v === undefined)) {
      return res.status(400).json({ message: "origin, destination and currentRangeKm are required" });
    }

    const tripDistanceKm = Math.round(distanceKm(originLat, originLng, destLat, destLng) * 10) / 10;
    const estimatedMinutes = Math.round((tripDistanceKm / 45) * 60); // avg 45 km/h assumption

    const feasible = currentRangeKm >= tripDistanceKm;

    let chargingStops = [];
    if (!feasible) {
      const stations = await ChargingStation.find();
      // find stations roughly along the path (within a corridor) and reachable with current range
      chargingStops = stations
        .map((s) => {
          const distFromOrigin = distanceKm(originLat, originLng, s.latitude, s.longitude);
          const distToDest = distanceKm(s.latitude, s.longitude, destLat, destLng);
          const detour = distFromOrigin + distToDest - tripDistanceKm;
          return { station: s, distFromOrigin, distToDest, detour };
        })
        .filter((s) => s.distFromOrigin <= currentRangeKm && s.detour < 20)
        .sort((a, b) => a.detour - b.detour)
        .slice(0, 3)
        .map((s) => ({
          id: s.station._id,
          name: s.station.name,
          address: s.station.address,
          latitude: s.station.latitude,
          longitude: s.station.longitude,
          distFromOriginKm: Math.round(s.distFromOrigin * 10) / 10,
          detourKm: Math.round(s.detour * 10) / 10,
        }));
    }

    res.json({
      tripDistanceKm,
      estimatedMinutes,
      feasibleWithCurrentRange: feasible,
      batteryConsumptionEstimatePercent: Math.min(100, Math.round((tripDistanceKm / (currentRangeKm || 1)) * 100)),
      recommendedChargingStops: chargingStops,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
