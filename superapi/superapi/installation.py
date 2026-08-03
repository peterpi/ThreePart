

from flask import Blueprint, request, abort
from .db import get_db


bp = Blueprint ("installation", __name__)


@bp.get("")
def get_installation_uuid():
	db = get_db()
	row = db.execute ("SELECT id FROM INSTALLATION").fetchone()
	if not row:
		return {}
	return dict(row)
	

@bp.post("")
def bootstrap_new_installation():
	j = request.json
	db = get_db()
	try:
		email = j["email"]
		cur = db.execute("INSERT INTO account (email) values (%s) RETURNING id", (email,))
		superuserId = cur.fetchone()["id"]
		cur = db.execute("INSERT INTO installation (superuser) VALUES (%s) RETURNING id", (superuserId,))
		installationId = cur.fetchone()["id"]
		db.commit()
		return {"id":installationId}
	except Exception as x:
		abort(400)