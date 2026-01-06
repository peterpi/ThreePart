import psycopg


def get_db ():
	url = f"postgres://bookings@db/bookings-orgs"
	db = psycopg.connect (url, password = "Hello")
	return db