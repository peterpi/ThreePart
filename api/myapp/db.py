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
	dbuser = user["dbuser"]
	dbhost = user["dbhostname"]
	dbpass = user["pass"]
	dbname = user["dbname"]
	url = f"postgres://{dbuser}:{dbpass}@{dbhost}/{dbname}"
	db = psycopg.connect (url, password = dbpass)
	db.row_factory = psycopg.rows.dict_row
	g.db = db
	return db

def close_db (e = None):
	db = g.pop("db", None)
	if not db :
		return
	db.close()