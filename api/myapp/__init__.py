from flask import (Flask, request, Blueprint)

from werkzeug.middleware.proxy_fix import ProxyFix


def create_app():
	a = Flask (__name__)

	a.config["SECRET_KEY"] = "jfdskfjsdkl" # TODO Get from somewhere not in source control

	a.wsgi_app = ProxyFix(
		a.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
	)

	api = Blueprint ("api", __name__)
	
	from . import login
	api.register_blueprint(login.bp, url_prefix="/login")
	from . import services
	api.register_blueprint(services.bp, url_prefix="/services")
	a.register_blueprint(api, url_prefix="/api")

	from . import db
	a.teardown_appcontext(db.close_db)
	return a