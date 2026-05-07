"""Aurora/Kp index route."""

from datetime import datetime, timezone

from flask import Blueprint, jsonify

from cache import cached
from config import CACHE_TTL_KP
from services.noaa import fetch_kp_index

aurora_bp = Blueprint("aurora", __name__)


@aurora_bp.route("/api/aurora", methods=["GET"])
def get_aurora():
    """Get current Kp index and recent history."""
    try:
        data = _get_kp_data()
        data["timestamp"] = datetime.now(timezone.utc).isoformat()
        return jsonify(data)
    except Exception as e:
        return jsonify({
            "error": f"Failed to fetch aurora data: {str(e)}",
            "kp": None,
            "kpHistory": [],
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }), 502


@cached("kp_index", CACHE_TTL_KP)
def _get_kp_data():
    return fetch_kp_index()
