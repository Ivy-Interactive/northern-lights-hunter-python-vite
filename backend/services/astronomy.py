"""Astronomy service using the astral library."""

from datetime import date

from astral import LocationInfo
from astral.sun import sun, twilight, SunDirection
from astral.moon import phase


def get_sun_times(lat, lon, target_date):
    """Calculate sunrise, sunset, and twilight times for a location and date.

    Args:
        lat: Latitude
        lon: Longitude
        target_date: date object

    Returns:
        Dictionary with sunrise, sunset, dark start/end, and civil twilight times.
    """
    location = LocationInfo(
        name="Custom",
        region="Custom",
        timezone="UTC",
        latitude=lat,
        longitude=lon,
    )

    try:
        s = sun(location.observer, date=target_date)
        sunrise = s["sunrise"].isoformat()
        sunset = s["sunset"].isoformat()
    except Exception:
        sunrise = None
        sunset = None

    try:
        # Civil twilight (sun 0-6 degrees below horizon)
        civil_tw = twilight(location.observer, date=target_date, direction=SunDirection.SETTING)
        civil_twilight_end = civil_tw[1].isoformat()
    except Exception:
        civil_twilight_end = None

    try:
        civil_tw_morning = twilight(location.observer, date=target_date, direction=SunDirection.RISING)
        civil_twilight_start = civil_tw_morning[0].isoformat()
    except Exception:
        civil_twilight_start = None

    try:
        # Astronomical twilight marks true darkness
        from astral.sun import night
        n = night(location.observer, date=target_date)
        dark_start = n[0].isoformat()
        dark_end = n[1].isoformat()
    except Exception:
        dark_start = civil_twilight_end
        dark_end = civil_twilight_start

    return {
        "sunrise": sunrise,
        "sunset": sunset,
        "darkStart": dark_start,
        "darkEnd": dark_end,
        "civilTwilightEnd": civil_twilight_end,
        "civilTwilightStart": civil_twilight_start,
    }


def get_moon_info(target_date):
    """Calculate moon phase and illumination for a date.

    Args:
        target_date: date object

    Returns:
        Dictionary with moon phase (0-1) and illumination percentage.
    """
    moon_phase = phase(target_date)

    # astral phase() returns 0-27.99 where:
    # 0 = new moon, 7 = first quarter, 14 = full moon, 21 = last quarter
    # Normalize to 0-1
    phase_normalized = moon_phase / 27.99

    # Calculate illumination percentage
    # 0 (new) = 0%, 14 (full) = 100%
    if moon_phase <= 14:
        illumination = (moon_phase / 14.0) * 100
    else:
        illumination = ((27.99 - moon_phase) / 13.99) * 100

    return {
        "moonPhase": round(phase_normalized, 3),
        "moonIllumination": round(illumination, 1),
    }
