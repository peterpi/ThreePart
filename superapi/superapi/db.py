
import psycopg
import psycopg.rows
from flask import g


def get_db():
	db = g.get("db")
	if db:
		return db
	url = f"postgres://bookings@db/bookings-orgs"
	db = psycopg.connect(url, password = "Hello")
	db.cursor_factory = psycopg.rows.dict_row
	g.db = p
	return db

def close_db(e = None):
	db = g.pop("db", None)
	if not db:
		return
	db.close()