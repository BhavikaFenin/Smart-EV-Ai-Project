# AI-Based Smart EV Assistant

Full-stack app: battery failure prediction (ML), charging station finder, slot booking, and a smart EV route planner.

**Stack:** React (Vite + Tailwind) · Node.js/Express · MongoDB · Python (scikit-learn Random Forest)

```
ev-assistant/
├── client/   React frontend (Vite + Tailwind, green/blue theme)
├── server/   Node.js/Express REST API + MongoDB models
└── ml/       Python training + prediction scripts (Random Forest)
```

## 1. Prerequisites

- Node.js 18+
- Python 3.9+
- MongoDB running locally or a MongoDB Atlas connection string

## 2. Machine Learning model (train once)

```bash
cd ml
pip install -r requirements.txt
python train_model.py
```

This generates `battery_model.pkl` and `battery_scaler.pkl` (already included — re-run any time you want to retrain). `predict.py` is called automatically by the backend for every prediction request; you can also test it directly:

```bash
python predict.py '{"voltage":3.6,"temperature":30,"charging_cycles":400,"battery_age_months":18,"soh":85}'
```

## 3. Backend

```bash
cd server
npm install
cp .env.example .env      # then edit MONGO_URI, JWT_SECRET, etc.
npm run seed               # loads 5 sample charging stations (Jaipur area)
npm run dev                 # starts on http://localhost:5000
```

`.env` variables:
- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string
- `PYTHON_PATH` — usually `python3`
- `GOOGLE_MAPS_API_KEY` — needed once you wire the frontend map (see "What's stubbed" below)

## 4. Frontend

```bash
cd client
npm install
npm run dev                 # starts on http://localhost:5173
```

Vite proxies `/api` to `http://localhost:5000`, so both must be running.

## 5. Using the app

1. Register an account at `/register`.
2. Add a vehicle at `/vehicles`.
3. Run a battery health check at `/battery` — this calls the real Random Forest model.
4. Browse `/stations` (uses your browser location, or falls back to Jaipur).
5. Book a slot at `/bookings`.
6. Try `/route-planner` with two lat/lng pairs.
7. To see the admin panel, manually set a user's `role` to `"admin"` in MongoDB, then visit `/admin`.

## What's implemented vs. stubbed

**Fully working:** auth (JWT + bcrypt), vehicle CRUD, ML-backed battery prediction with history + trend chart, charging station CRUD + nearby search (Haversine distance), slot booking with live slot counts, a distance-based route planner with charging-stop suggestions, and an admin analytics dashboard.

**Intentionally simplified (documented in code comments):**
- **Route planner** uses straight-line (Haversine) distance, not real road distance. Swap in the Google Directions API in `server/controllers/routeController.js` for turn-by-turn accuracy.
- **Map view** on the Station Finder page is list-based, not an embedded map. Add your `GOOGLE_MAPS_API_KEY` and drop in the Google Maps JavaScript API / `@react-google-maps/api` in `StationFinder.jsx` to render pins.
- **QR code booking confirmation**, **live real-time slot updates**, **payment gateway**, and **push notifications** are listed as future enhancements in the original spec and are not built.

## Sample login for testing

There's no pre-seeded user — register one via `/register`. Charging stations are seeded via `npm run seed` in `server/`.
