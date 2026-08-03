from flask import Blueprint, abort, request
from .auth import auth
from .db import get_db

bp = Blueprint ("org", __name__)

@bp.get("")
def get_some():
	d = get_db()
	orgs = d.execute ("SELECT * FROM org").fetchall()
	return {"orgs": orgs}



@bp.post("")
def new_org():
	db = get_db()
	j = request.json
	try:
		name = j["name"]
		cur = db.execute ("INSERT INTO org (orgname) VALUES (%s) RETURNING *", (name,))
		db.commit()
		return dict(cur.fetchone())
	except:
		abort (400)
	
