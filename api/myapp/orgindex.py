import psycopg
import psycopg.rows


def get_db ():
	url = f"postgres://bookings@db/bookings-orgs"
	db = psycopg.connect (url, password = "Hello")
	db.row_factory = psycopg.rows.dict_row
	return db