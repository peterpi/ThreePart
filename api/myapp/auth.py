
from flask_httpauth import (HTTPBasicAuth)
from . import orgindex

auth = HTTPBasicAuth()


@auth.verify_password
def _verify(username, password):
	return {
		"org" : "whatever"
	}


here set up database for orgs etc