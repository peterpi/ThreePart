from flask import Flask

from werkzeug.middleware.proxy_fix import ProxyFix


def create_app():
	app = Flask (__name__)

	app.wsgi_app = ProxyFix(
		app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
	)

	from . import org
	app.register_blueprint(org.bp, url_prefix="/orgs")

	from . import accounts
	app.register_blueprint(accounts.bp)

	@app.route("/healthcheck")
	def hello():
		return "Hello from superapi"

	from . import db
	app.teardown_appcontext(db.close_db)

	from . import installation
	app.register_blueprint(installation.bp, url_prefix="/installation")


	return app
