# server/auth/__init__.py
from flask import Blueprint

auth_bp = Blueprint("auth", __name__)  # Comment: groups auth routes under one BP

from . import routes  # noqa: F401  # Comment: registers the route functions below
