const { spawn } = require("child_process");
const path = require("path");

/**
 * Calls the Python ML script to get a battery health prediction.
 * Expects an object: { voltage, temperature, chargingCycles, batteryAgeMonths, soh }
 */
function predictBatteryHealth(data) {
  return new Promise((resolve, reject) => {
    const pythonExecutable = process.env.PYTHON_PATH || "python3";
    const scriptPath = path.join(__dirname, "..", "..", "ml", "predict.py");

    const payload = JSON.stringify({
      voltage: data.voltage,
      temperature: data.temperature,
      charging_cycles: data.chargingCycles,
      battery_age_months: data.batteryAgeMonths,
      soh: data.soh,
    });

    const py = spawn(pythonExecutable, [scriptPath, payload]);

    let output = "";
    let errorOutput = "";

    py.stdout.on("data", (chunk) => (output += chunk.toString()));
    py.stderr.on("data", (chunk) => (errorOutput += chunk.toString()));

    py.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(errorOutput || "ML prediction script failed"));
      }
      try {
        resolve(JSON.parse(output.trim()));
      } catch (err) {
        reject(new Error("Failed to parse ML script output: " + output));
      }
    });
  });
}

module.exports = { predictBatteryHealth };
