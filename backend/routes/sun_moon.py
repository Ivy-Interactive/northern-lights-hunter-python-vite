"""Sun and moon route."""

from datetime import date, datetime

from flask import Blueprint, jsonify, request

from cache import cached
from config import DEFAULT_LAT, DEFAULT_LON, CACHE_TTL_WEATHER
from services.astronomy import get_sun_times, get_moon_info

sun_moon_bp = Blueprint("sun_moon", __name__)


@sun_moon_bp.route("/api/sun-moon", methods=["GET"])
def get_sun_moon():
    """Get sun and moon data for a location and date."""
    try:
        lat = float(request.args.get("lat", DEFAULT_LAT))
        lon = float(request.args.get("lon", DEFAULT_LON))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid lat/lon parameters"}), 400

    date_str = request.args.get("date")
    try:
        if date_str:
            target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        else:
            target_date = date.today()
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    try:
        data = _get_sun_moon_data(lat, lon, target_date.isoformat())
        return jsonify(data)
    except Exception as e:
        return jsonify({
            "error": f"Failed to calculate sun/moon data: {str(e)}",
        }), 500


@cached("sun_moon", CACHE_TTL_WEATHER)
def _get_sun_moon_data(lat, lon, date_str):
    target_date = date.fromisoformat(date_str)
    sun_data = get_sun_times(lat, lon, target_date)
    moon_data = get_moon_info(target_date)
    return {**sun_data, **moon_data}
