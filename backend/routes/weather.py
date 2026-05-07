"""Weather route."""

from flask import Blueprint, jsonify, request

from cache import cached
from config import CACHE_TTL_WEATHER, DEFAULT_LAT, DEFAULT_LON
from services.open_meteo import fetch_weather

weather_bp = Blueprint("weather", __name__)


@weather_bp.route("/api/weather", methods=["GET"])
def get_weather():
    """Get hourly weather forecast for a location."""
    try:
        lat = float(request.args.get("lat", DEFAULT_LAT))
        lon = float(request.args.get("lon", DEFAULT_LON))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid lat/lon parameters"}), 400

    try:
        data = _get_weather_data(lat, lon)
        return jsonify(data)
    except Exception as e:
        return jsonify({
            "error": f"Failed to fetch weather data: {str(e)}",
            "hourly": [],
        }), 502


@cached("weather", CACHE_TTL_WEATHER)
def _get_weather_data(lat, lon):
    return fetch_weather(lat, lon)
