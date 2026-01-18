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
		cur = index.execute ("SELECT * FROM org_user WHERE id = %s", (username,))
		user = cur.fetchone()
		if not user:
			return False
		orgId = str(user["org"])
		cur = index.execute ("SELECT * FROM org WHERE id = %s", (orgId,))
		org = cur.fetchone()
		u = dict (user)
		u["org"] = org
		session["user"] = u
		return u
