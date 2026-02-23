
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


@bp.post("")
@auth.login_required
def post_new():
	j = request.json
	name = j["name"] or abort (400)
	with get_db() as db:
		try:
			cur = db.execute ("INSERT INTO service (name, uuid) VALUES (%s, uuidv4()) RETURNING name, uuid", (name,))
			row = cur.fetchone()
			return row
		except:
			abort (400) # Blame the user :p

@bp.put("<uuid:uuid>")
@auth.login_required
def put_existing(uuid):
	j = request.json
	name = j["name"] or abort (400)
	with get_db() as db:
		cur = db.execute ("UPDATE service SET name = %s WHERE uuid = %s RETURNING name,uuid", (name, uuid))
		row = cur.fetchone()
		if not row:
			abort (404)
		return row