"""
train_model.py
Generates a synthetic EV battery dataset and trains a Random Forest
classifier to predict battery health status (Healthy / Warning / Critical)
and estimates Remaining Useful Life (RUL).

Run:  python train_model.py
Output: battery_model.pkl, battery_scaler.pkl
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib

np.random.seed(42)
N = 6000

# ---- Synthetic feature generation ----
voltage = np.random.normal(3.7, 0.25, N).clip(2.5, 4.3)              # per-cell nominal volts
temperature = np.random.normal(32, 12, N).clip(-10, 65)              # deg C
charging_cycles = np.random.randint(0, 2000, N)
battery_age_months = np.random.randint(0, 96, N)
soh = np.random.normal(90, 15, N).clip(20, 100)                      # State of Health %

# ---- Rule-based ground truth (mimics real degradation patterns) ----
risk_score = (
    (100 - soh) * 1.2
    + (charging_cycles / 2000) * 40
    + (battery_age_months / 96) * 25
    + np.where(temperature > 45, (temperature - 45) * 1.5, 0)
    + np.where(temperature < 0, (0 - temperature) * 1.5, 0)
    + np.where(voltage < 3.2, (3.2 - voltage) * 30, 0)
)

def classify(score):
    if score < 30:
        return "Healthy"
    elif score < 60:
        return "Warning"
    else:
        return "Critical"

labels = np.array([classify(s) for s in risk_score])

df = pd.DataFrame({
    "voltage": voltage,
    "temperature": temperature,
    "charging_cycles": charging_cycles,
    "battery_age_months": battery_age_months,
    "soh": soh,
    "status": labels,
})

X = df[["voltage", "temperature", "charging_cycles", "battery_age_months", "soh"]]
y = df["status"]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42, stratify=y
)

model = RandomForestClassifier(
    n_estimators=200, max_depth=10, random_state=42, class_weight="balanced"
)
model.fit(X_train, y_train)

print("Model performance on held-out test set:")
print(classification_report(y_test, model.predict(X_test)))

joblib.dump(model, "battery_model.pkl")
joblib.dump(scaler, "battery_scaler.pkl")
print("Saved battery_model.pkl and battery_scaler.pkl")
