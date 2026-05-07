"""Open-Meteo weather service."""

import requests

from config import OPEN_METEO_URL, REQUEST_TIMEOUT


def fetch_weather(lat, lon):
    """Fetch hourly weather data for 48 hours from Open-Meteo.

    Args:
        lat: Latitude
        lon: Longitude

    Returns:
        Dictionary with hourly weather data including cloud cover,
        temperature, and precipitation probability.
    """
    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": "cloud_cover,temperature_2m,precipitation_probability",
        "forecast_hours": 48,
    }

    response = requests.get(OPEN_METEO_URL, params=params, timeout=REQUEST_TIMEOUT)
    response.raise_for_status()
    data = response.json()

    hourly = data.get("hourly", {})
    times = hourly.get("time", [])
    cloud_cover = hourly.get("cloud_cover", [])
    temps = hourly.get("temperature_2m", [])
    precip_prob = hourly.get("precipitation_probability", [])

    result = []
    for i in range(len(times)):
        result.append({
            "time": times[i],
            "cloudCover": cloud_cover[i] if i < len(cloud_cover) else None,
            "temp": temps[i] if i < len(temps) else None,
            "precipProb": precip_prob[i] if i < len(precip_prob) else None,
        })

    return {"hourly": result}
