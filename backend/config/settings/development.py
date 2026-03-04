from .base import *
from decouple import config

DEBUG = config("DEBUG", default=True, cast=bool)

DATABASES["default"]["CONN_MAX_AGE"] = 0
