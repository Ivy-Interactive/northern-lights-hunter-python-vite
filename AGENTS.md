# Northern Lights Hunter

A web application for tracking and predicting aurora borealis (Northern Lights) viewing conditions.

## Overview

Northern Lights Hunter helps users plan optimal times and locations for viewing the aurora borealis by providing real-time geomagnetic activity data, weather forecasts, and astronomical conditions.

## Tech Stack

**Frontend:**
- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Lucide React for icons

**Backend:**
- Python 3 with Flask
- NOAA API integration for Kp index (geomagnetic activity)
- Weather and astronomical data APIs
- In-memory caching for API responses

## Architecture

- **SPA Frontend:** React single-page application with multiple routes (Dashboard, Conditions, Planning, Forecast, Alerts, Logbook, Spots, Learn)
- **REST API Backend:** Flask serving JSON endpoints under `/api`
- **Dev Proxy:** Vite dev server proxies `/api` requests to Flask backend
- **Multi-instance Support:** Run multiple development instances in parallel with automatic port assignment

## Key Features

- **Real-time Kp Index:** Current and historical geomagnetic activity levels
- **Aurora Forecasts:** Predictive data for upcoming viewing opportunities
- **Weather Integration:** Cloud cover and visibility conditions
- **Sun/Moon Data:** Astronomical conditions affecting aurora visibility
- **Interactive Dashboard:** Visual display of aurora probability and conditions
- **Planning Tools:** Help users identify optimal viewing windows

## Development

See [RUNNING-MULTIPLE-INSTANCES.md](RUNNING-MULTIPLE-INSTANCES.md) for details on running multiple instances.

### Quick Start
```powershell
# Install dependencies and start dev servers
.\Run.ps1
```

### Project Structure
```
northern-lights-hunter-python-vite/
├── frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Route pages
│   │   └── App.tsx     # Main app component
│   └── vite.config.ts
├── backend/            # Flask backend
│   ├── routes/         # API route blueprints
│   │   ├── aurora.py   # Kp index endpoints
│   │   ├── forecast.py # Forecast data
│   │   ├── weather.py  # Weather conditions
│   │   └── sun_moon.py # Astronomical data
│   ├── services/       # External API clients
│   ├── app.py          # Flask app factory
│   └── requirements.txt
└── Run.ps1             # Development launcher
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/aurora` - Current Kp index and history
- `GET /api/forecast` - Aurora forecast data
- `GET /api/weather` - Weather conditions
- `GET /api/sun-moon` - Sun/moon rise/set times

## Data Sources

- NOAA Space Weather Prediction Center (Kp index)
- Weather APIs (cloud cover, visibility)
- Astronomical calculation libraries (sun/moon positions)
