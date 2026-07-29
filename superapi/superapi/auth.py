from flask_httpauth import HTTPTokenAuth

auth = HTTPTokenAuth(scheme="Bearer")

@auth.verify_token
def __verify():
	return "Peter"