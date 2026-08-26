from flask import Blueprint, abort, request
from .db import get_db

bp = Blueprint ("accounts", __name__, url_prefix="/accounts")


@bp.get("")
def get_all():
	with get_db() as db:
		cur = db.execute("SELECT id, email FROM account")
		accounts = list(map (lambda x : dict(x), cur.fetchall()))
		return {"accounts": accounts}

@bp.post("")
def new_user():
	j = request.json or abort (400)
	email = j["email"] or abort (400)
	with get_db() as db:
		try :
			cur = db.execute ("INSERT INTO account(email) VALUES (%s) RETURNING id,email", (email,))
			db.commit()
		except Exception as x:
			abort (400)
		row = cur.fetchone()
		return dict(row)


@bp.get("/<string:email>")
def get_by_email(email):
	with get_db() as db:
		cur = db.execute ("SELECT * FROM account WHERE email = %s", (email,))
		row = cur.fetchone() or abort(404)
		return dict(row)



@bp.get("/<string:id>/orgmemberships")
def get_memberships_by_id(id):
	with get_db() as db:
		#id = str(id)
		cur = db.execute ("SELECT id, orgname FROM org_account_membership JOIN org ON org = id WHERE account = %s", (id,))
		memberships = list(map (lambda x : dict(x), cur.fetchall()))
		return {"memberships": memberships}