
import psycopg
import psycopg.rows
from flask import g


def get_db():
	db = g.get("db")
	if db:
		return db
	url = f"postgres://superapi@tenant_index/tenant-index"
	db = psycopg.connect(url, password = "hello")
	db.row_factory = psycopg.rows.dict_row
	g.db = db
	return db

def close_db(e = None):
	db = g.pop("db", None)
	if not db:
		return
	db.close()