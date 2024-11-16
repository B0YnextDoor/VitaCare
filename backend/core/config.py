from dotenv import load_dotenv
from os import getenv

load_dotenv()


class ENV():
    DATABASE_URL = getenv("DATABASE_URL")
    DOMAIN = getenv("DOMAIN")
    ACCESS = getenv("ACCESS_TOKEN")
    REFRESH = getenv("REFRESH_TOKEN")
    ACCESS_EXPIRES_IN = getenv("ACCESS_TOKEN_EXPIRES_IN")
    REFRESH_EXPIRES_IN = getenv("REFRESH_TOKEN_EXPIRES_IN")
    ACCESS_SECRET = getenv("JWT_ACCESS_SECRET")
    REFRESH_SECRET = getenv("JWT_REFRESH_SECRET")


config = ENV()
