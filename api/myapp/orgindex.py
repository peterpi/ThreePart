import psycopg
import psycopg.rows


def get_db ():
	url = f"postgres://superapi@tenant_index/tenant-index"
	db = psycopg.connect (url, password = "hello")
	db.row_factory = psycopg.rows.dict_row
	return db