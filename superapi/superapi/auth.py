from flask_httpauth import HTTPTokenAuth
from .db import get_db
auth = HTTPTokenAuth(scheme="Bearer")

@auth.verify_token
def __verify(token):
	db = get_db()
	# We can check the existence of the token and update the last-use time
	# in a single SQL statement
	cur = db.execute ("UPDATE access_token SET last_used = 'now' WHERE token = %s RETURNING token;", (token,))
	row = cur.fetchone()
	if not row :
		return False
	cur = db.execute ("SELECT token, id, uuid, org FROM access_token, org_user WHERE token = %s AND owner = uuid", (token,))
	row = cur.fetchone()
	return dict(row)
