from flask import (session,)
from flask_httpauth import (HTTPBasicAuth)
from . import orgindex

auth = HTTPBasicAuth()


@auth.verify_password
def _verify(username, password):
	# If there is already a session then allow them through.
	u = session.get("user")
	if u:
		return u
	with orgindex.get_db() as index:
		cur = orgindex.execute ("SELECT * FROM org_user WHERE id = %s", (username))
		row = cur.fetchone()
		if not row:
			return False
		u = dict (cur.fetchone())
		return u
