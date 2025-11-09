# server/map/__init__.py
from flask import Blueprint

map_bp = Blueprint("map_bp", __name__)

# register routes
from . import routes  # noqa: E402,F401
