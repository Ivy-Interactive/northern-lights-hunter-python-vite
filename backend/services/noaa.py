"""NOAA Space Weather Prediction Center service."""

import requests

from config import NOAA_KP_INDEX_URL, NOAA_KP_FORECAST_URL, REQUEST_TIMEOUT


def fetch_kp_index():
    """Fetch and parse the current Kp index data from NOAA.

    Returns the last 24 entries from the planetary K-index JSON.
    The API returns a list of objects with keys: time_tag, Kp, a_running, station_count.
    """
    response = requests.get(NOAA_KP_INDEX_URL, timeout=REQUEST_TIMEOUT)
    response.raise_for_status()
    data = response.json()

    # Take last 24 entries
    recent = data[-24:]

    kp_history = []
    for entry in recent:
        kp_history.append({
            "time": entry["time_tag"],
            "kp": float(entry["Kp"]),
        })

    current_kp = kp_history[-1]["kp"] if kp_history else 0.0

    return {
        "kp": current_kp,
        "kpHistory": kp_history,
    }


def fetch_forecast():
    """Fetch and parse the Kp index forecast from NOAA.

    Returns forecast data grouped by date with high/low Kp values.
    The API returns a list of objects with keys: time_tag, kp, observed, noaa_scale.
    """
    response = requests.get(NOAA_KP_FORECAST_URL, timeout=REQUEST_TIMEOUT)
    response.raise_for_status()
    data = response.json()

    # Group by date
    days = {}
    for entry in data:
        time_tag = entry["time_tag"]
        kp_value = float(entry["kp"])
        date = time_tag.split("T")[0]

        if date not in days:
            days[date] = {"date": date, "kpHigh": kp_value, "kpLow": kp_value}
        else:
            days[date]["kpHigh"] = max(days[date]["kpHigh"], kp_value)
            days[date]["kpLow"] = min(days[date]["kpLow"], kp_value)

    return {"days": list(days.values())}
