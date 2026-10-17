"""
predict.py
Loads the trained Random Forest model and returns a battery health
prediction as JSON. Can be called two ways:

1. From the command line (used by the Node.js backend via child_process):
   python predict.py '{"voltage":3.6,"temperature":30,"charging_cycles":400,"battery_age_months":18,"soh":85}'

2. As a small Flask microservice (optional, useful for local testing):
   python predict.py --serve
   POST http://localhost:5001/predict  with the same JSON body
"""

import sys
import json
import joblib
import numpy as np
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "battery_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "battery_scaler.pkl")

FEATURES = ["voltage", "temperature", "charging_cycles", "battery_age_months", "soh"]


def load_model():
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    return model, scaler


def estimate_rul(data):
    """Simple heuristic Remaining Useful Life estimate (in charge cycles)."""
    max_cycles = 2000
    used = data["charging_cycles"]
    soh_factor = data["soh"] / 100
    remaining = max(0, (max_cycles - used) * soh_factor)
    return round(remaining)


def suggestions_for(status, data):
    tips = []
    if status == "Critical":
        tips.append("Battery health is critical. Schedule a professional inspection immediately.")
    if status == "Warning":
        tips.append("Battery is degrading faster than normal. Avoid fast charging when possible.")
    if data["temperature"] > 45:
        tips.append("Operating temperature is high. Park in shade and avoid charging in direct heat.")
    if data["temperature"] < 0:
        tips.append("Cold temperatures reduce battery efficiency. Precondition battery before driving.")
    if data["voltage"] < 3.2:
        tips.append("Cell voltage is low. Avoid deep discharges below 20%.")
    if data["charging_cycles"] > 1500:
        tips.append("High cycle count detected. Consider battery replacement planning.")
    if not tips:
        tips.append("Battery is in good condition. Maintain regular charging habits (20-80%).")
    return tips


def predict(data):
    model, scaler = load_model()
    row = np.array([[data[f] for f in FEATURES]])
    row_scaled = scaler.transform(row)

    status = model.predict(row_scaled)[0]
    proba = model.predict_proba(row_scaled)[0]
    classes = model.classes_
    confidence = round(float(max(proba)) * 100, 1)

    health_percentage = round(float(data["soh"]), 1)
    rul_cycles = estimate_rul(data)

    return {
        "status": status,
        "confidence": confidence,
        "health_percentage": health_percentage,
        "remaining_useful_life_cycles": rul_cycles,
        "class_probabilities": {c: round(float(p) * 100, 1) for c, p in zip(classes, proba)},
        "suggestions": suggestions_for(status, data),
    }


if __name__ == "__main__":
    if "--serve" in sys.argv:
        from flask import Flask, request, jsonify
        from flask_cors import CORS

        app = Flask(__name__)
        CORS(app)

        @app.route("/predict", methods=["POST"])
        def serve_predict():
            body = request.get_json()
            try:
                result = predict(body)
                return jsonify(result)
            except Exception as e:
                return jsonify({"error": str(e)}), 400

        app.run(port=5001)
    else:
        input_json = json.loads(sys.argv[1])
        print(json.dumps(predict(input_json)))
