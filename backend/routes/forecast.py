"""Aurora forecast route."""

from flask import Blueprint, jsonify

from cache import cached
from config import CACHE_TTL_FORECAST
from services.noaa import fetch_forecast

forecast_bp = Blueprint("forecast", __name__)


@forecast_bp.route("/api/forecast", methods=["GET"])
def get_forecast():
    """Get Kp index forecast for upcoming days."""
    try:
        data = _get_forecast_data()
        return jsonify(data)
    except Exception as e:
        return jsonify({
            "error": f"Failed to fetch forecast data: {str(e)}",
            "days": [],
        }), 502


@cached("kp_forecast", CACHE_TTL_FORECAST)
def _get_forecast_data():
    return fetch_forecast()
