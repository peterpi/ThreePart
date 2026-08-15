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
	with orgindex.get_db() as db:
		cur = db.execute ("SELECT org.id AS org, account.email AS email FROM org JOIN org_account_membership ON org.id = org_account_membership.org JOIN account on account.id = org_account_membership.account WHERE account.email = %s", (username,))
		user = cur.fetchone()
		if not user:
			return False
		u = dict (user)
		session["user"] = u
		return u
