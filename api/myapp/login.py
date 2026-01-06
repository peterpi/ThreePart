from flask import (app, request, Blueprint, session)
from ./auth import auth
bp = Blueprint ("login", __name__)


@bp.post ("")
@auth.login_required
def _login ():
	user = auth.current_user()
	session["user"] = user
	greeting = {
		"Hello": "World"
	}
	return greeting