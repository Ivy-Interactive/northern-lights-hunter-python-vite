"""Configuration for Northern Lights Hunter backend."""

# NOAA Space Weather Prediction Center URLs
NOAA_KP_INDEX_URL = "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json"
NOAA_KP_FORECAST_URL = "https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json"

# Open-Meteo API URL
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

# Cache TTLs in seconds
CACHE_TTL_KP = 15 * 60        # 15 minutes
CACHE_TTL_WEATHER = 30 * 60   # 30 minutes
CACHE_TTL_FORECAST = 60 * 60  # 1 hour

# Default location (Tromso, Norway)
DEFAULT_LAT = 69.65
DEFAULT_LON = 18.96

# Request timeout in seconds
REQUEST_TIMEOUT = 10
