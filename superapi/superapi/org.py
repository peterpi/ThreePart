from flask import Blueprint, abort, request
from .auth import auth
from .db import get_db

import psycopg

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
		cur = db.execute ("INSERT INTO org (orgname) VALUES (%s) RETURNING id", (name,))
		org_row = cur.fetchone()
		org_id = str(org_row["id"])
		# The creation of a database cannot happen within a transaction,
		# so we have to commit the INSERT and then use Python's try/catch
		# to account for failures in creating the new org's database
		db.commit()
		try:
			# Use the org uuid as part of the database name.
			# Postgres says that database names must start with a-z,
			# and also that the "-" in a uuid is invalid.
			# So:
			org_db = f"org_{org_id.replace("-", "_")}" # e.g. org_1ffac468_7313_4f73_98c5_8935ccfe3896
			db.autocommit = True
			db.execute (f"CREATE DATABASE {org_db} WITH TEMPLATE = new_org_template")
		except Exception as x:
			db.rollback()
			db.execute ("DELETE FROM org WHERE id = %s", (org_id,))
			db.commit()
			raise x
		return dict(org_row)
	except Exception as x:
		abort (400)
	
