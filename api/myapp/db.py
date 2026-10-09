import psycopg
import psycopg.rows
from .auth import auth
from flask import (g, session)


from sqlalchemy import create_engine
from sqlalchemy.orm import Session


def _get_postgres_url():
	user = auth.current_user()
	dbuser = user["dbuser"]
	dbhost = user["dbhostname"]
	dbpass = user["pass"]
	dbname = user["dbname"]
	url = f"postgres://{dbuser}:{dbpass}@{dbhost}/{dbname}"
	return url

@auth.login_required
def get_db():
	db = g.get("db")
	if db:
		return db
	url = _get_postgres_url()
	dbpass = auth.current_user()["pass"]
	db = psycopg.connect (url, password = dbpass) # TODO Do we need to specify the password AGAIN?
	db.row_factory = psycopg.rows.dict_row
	g.db = db
	return db

@auth.login_required
def get_session():
	# Note that this is slightly different to the string
	# that is passed into psycopg.connect.
	# "postgres" vs "postgresql"
	user = auth.current_user()
	dbuser = user["dbuser"]
	dbpass = user["pass"]
	dbhost = user["dbhostname"]
	dbname = user["dbname"]
	url = f"postgresql://{dbuser}:{dbpass}@{dbhost}/{dbname}"
	engine = create_engine(url)
	session = Session(engine)
	return session


def close_db (e = None):
	db = g.pop("db", None)
	if not db :
		return
	db.close()