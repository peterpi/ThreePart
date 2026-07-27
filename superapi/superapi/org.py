from flask import (Blueprint)
from .auth import auth

bp = Blueprint ("org", __name__)

@bp.get("/")
@auth.login_required
def get_some():
	test = [1, 2, 3]
	return test