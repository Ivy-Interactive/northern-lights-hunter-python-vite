"""In-memory TTL cache for API responses."""

import time
from functools import wraps

# In-memory cache: key -> (data, expiry_timestamp)
_cache = {}


def cached(key, ttl):
    """Decorator for caching function results with a TTL.

    Args:
        key: Base cache key string
        ttl: Time-to-live in seconds
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            now = time.time()
            cache_key = key if not args and not kwargs else f"{key}:{args}:{kwargs}"
            if cache_key in _cache:
                data, expiry = _cache[cache_key]
                if now < expiry:
                    return data
            result = fn(*args, **kwargs)
            _cache[cache_key] = (result, now + ttl)
            return result
        return wrapper
    return decorator
