

from flask import (Blueprint, abort, request)
from .auth import auth
from .db import get_db

bp = Blueprint ("staff", __name__)

@bp.get("")
@auth.login_required
def get_all():
	staff = []
	with get_db() as db:
		cur = db.execute ("SELECT * FROM staff")
		staff = list (map (lambda x : dict(x), cur))
	return {"staff":staff}