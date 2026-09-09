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
		# Lots of joins here.
		# Find the account and then join that to org_account_membership, org, and finally dbhost
		cur = db.execute ("SELECT account.id, org.orgname, org.dbname, dbhost.hostname AS dbhostname, dbhost.username AS dbuser, dbhost.pass  FROM account JOIN org_account_membership ON account.id = org_account_membership.account JOIN org on org_account_membership.org = org.id JOIN dbhost on org.dbhost = dbhost.id WHERE account.email = %s", (username,))
		user = cur.fetchone()
		if not user:
			return False
		u = dict (user)
		session["user"] = u
		return u
