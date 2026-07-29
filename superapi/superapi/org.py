from flask import (Blueprint)
from .auth import auth
from .db import get_db

bp = Blueprint ("org", __name__)

@bp.get("/")
@auth.login_required
def get_some():
	d = get_db()
	orgs = d.execute ("SELECT * FROM org").fetchall()
	return orgs