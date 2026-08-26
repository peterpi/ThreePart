from flask import Blueprint, abort, request
from .auth import auth
from .db import get_db
import uuid

import psycopg

bp = Blueprint ("org", __name__)


def db_name_for_org (orgId) :
	orgDb = f"org_{orgId.replace("-", "_")}" # e.g. org_1ffac468_7313_4f73_98c5_8935ccfe3896
	return orgDb


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
		name = j["name"] or abort (400)
		dbHost = 1 # Eventually we'll choose a host to serve this new org.
		id = uuid.uuid4()
		dbName = f"org_{str(id).replace("-", "_")}"
		cur = db.execute (
			"INSERT INTO org (id, orgname, dbHost, dbName) VALUES (%s, %s, %s, %s) RETURNING orgname, id",
			 (str(id), name, dbHost, dbName))
		org_row = cur.fetchone()
		# The creation of a database cannot happen within a transaction,
		# so we have to commit the INSERT and then use Python's try/catch
		# to account for failures in creating the new org's database
		db.commit()
		try:
			host = db.execute ("SELECT * FROM dbHost WHERE id = %s", (dbHost,)).fetchone()
			url = f"postgres://{host["username"]}:{host["pass"]}@{host["hostname"]}/{host["db"]}"
			template = "new_org_template"
			with psycopg.connect(url, autocommit=True) as db2:
				db2.execute (f"CREATE DATABASE {dbName} WITH TEMPLATE = {template}")
				db2.commit()
		except Exception as x:
			db.rollback()
			db.execute ("DELETE FROM org WHERE id = %s", (id,))
			db.commit()
			raise x
		return dict(org_row)
	except Exception as x:
		abort (400)
	


@bp.delete("<uuid:orgId>")
def delete_org(orgId):
	with get_db() as db:
		db.execute ("DELETE FROM org WHERE id = %s", (orgId,))
	return ({}, 204)
