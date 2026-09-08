import psycopg
import psycopg.rows
from .auth import auth
from flask import (g, session)

@auth.login_required
def get_db():
	db = g.get("db")
	if db:
		return db
	user = auth.current_user()
	org = auth.current_user()["org"]
	org = str(org) # uuid -> str
	dbName = f"org_{org.replace("-", "_")}"
	url = f"postgres://bookings@db/{dbName}"
	db = psycopg.connect (url, password = "Hello")
	db.row_factory = psycopg.rows.dict_row
	g.db = db
	return db

def close_db (e = None):
	db = g.pop("db", None)
	if not db :
		return
	db.close()