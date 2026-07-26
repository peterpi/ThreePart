import psycopg
import psycopg.rows

# TODO Investigate this higher-level library: https://pypi.org/project/postgres/

def get_db ():
	url = f"postgres://bookings@db/bookings-orgs"
	db = psycopg.connect (url, password = "Hello")
	db.row_factory = psycopg.rows.dict_row
	return db