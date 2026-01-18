
from flask import (Blueprint, request, abort)
from .auth import auth
from .db import get_db

bp = Blueprint("services", __name__)


@bp.get("")
@auth.login_required
def get_all():
	db = get_db()
	cur = db.execute ("SELECT uuid, name FROM service")
	all = cur.fetchall()
	return {"services" : all}


@bp.post("/")
@auth.login_required
def post_new():
	j = request.json
	name = j["name"] or abort (400)
	with get_db() as db:
		db.execute ("INSERT INTO service (name) VALUES (%s)", (name,))
	return ("", 204)

