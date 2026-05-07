"""Flask application for Northern Lights Hunter backend."""

from flask import Flask, jsonify
from flask_cors import CORS

from routes.aurora import aurora_bp
from routes.forecast import forecast_bp
from routes.weather import weather_bp
from routes.sun_moon import sun_moon_bp


def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)

    # Enable CORS for Vite dev server
    CORS(app, origins="*")

    # Register blueprints
    app.register_blueprint(aurora_bp)
    app.register_blueprint(forecast_bp)
    app.register_blueprint(weather_bp)
    app.register_blueprint(sun_moon_bp)

    # Health check endpoint
    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok", "service": "northern-lights-hunter"})

    # Error handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "Internal server error"}), 500

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"error": "Bad request"}), 400

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
